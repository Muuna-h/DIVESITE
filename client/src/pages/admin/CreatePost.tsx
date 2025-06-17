import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { Category } from "@shared/schema";
import ImageUpload from "@/components/ui/image-upload";
import type { User, Session } from "@supabase/supabase-js";

// Define the expected shape of the user data
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const AdminCreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    image: "",
    topImage: "",
    midImage: "",
    bottomImage: "",
    categoryId: "",
    tags: [] as string[],
    featured: false
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true
  });
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle authentication with Supabase directly
  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          if (mounted) {
            setAuthState({ user: null, session: null, isLoading: false });
            navigate("/admin/login");
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setAuthState({ user: null, session: null, isLoading: false });
            navigate("/admin/login");
          }
          return;
        }

        if (mounted) {
          setAuthState({
            user: session.user,
            session: session,
            isLoading: false
          });
        }
      } catch (error) {
        console.error("Session fetch error:", error);
        if (mounted) {
          setAuthState({ user: null, session: null, isLoading: false });
          navigate("/admin/login");
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setAuthState({ user: null, session: null, isLoading: false });
          navigate("/admin/login");
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setAuthState({
            user: session.user,
            session: session,
            isLoading: false
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Query for categories - only enabled when authenticated
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<{ categories: Category[] }>({
    queryKey: ['/api/categories'],
    enabled: !!authState.user && !authState.isLoading,
    select: (data) => data.categories,
  });

  // Create article mutation
  const createArticle = useMutation({
    mutationFn: async (articleData: Omit<typeof formData, 'categoryId'> & { categoryId: number }) => {
      if (!authState.user) {
        throw new Error("User not authenticated");
      }

      // Insert the article data into Supabase
      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: articleData.title,
          slug: articleData.slug,
          summary: articleData.summary,
          content: articleData.content,
          image: articleData.image,
          topImage: articleData.topImage || null,
          midImage: articleData.midImage || null,
          bottomImage: articleData.bottomImage || null,
          category_id: articleData.categoryId,
          tags: articleData.tags,
          featured: articleData.featured,
          author_id: authState.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Article created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/featured'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/latest'] });
      navigate(`/article/${data.slug}`);
    },
    onError: (error) => {
      console.error("Error creating article:", error);
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "title") {
      // Auto-generate slug when title changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add tag when pressing Enter
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add handler for image uploads
  const handleImageUploaded = (imageUrl: string, field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: imageUrl
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.summary || !formData.content || !formData.image || !formData.categoryId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert categoryId to number
    const submitData = {
      ...formData,
      categoryId: parseInt(formData.categoryId)
    };
    
    createArticle.mutate(submitData);
  };

  // Show loading spinner while checking authentication or loading categories
  if (authState.isLoading || isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!authState.user || !authState.session) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Create New Article - Dive Tech</title>
      </Helmet>

      <div className="bg-secondary dark:bg-gray-800 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-heading">Create New Article</h1>
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <i className="fas fa-arrow-left mr-2"></i> Back to Dashboard
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                    <CardDescription>
                      Create compelling content that engages readers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter article title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                      <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="article-url-slug"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This will be used in the article URL (auto-generated from title)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Summary <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Brief summary of the article (displayed in cards and previews)"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                        placeholder="Write your article content here..."
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Use the formatting toolbar to add headings, lists, links, and more to your content.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>
                      Upload article images
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">
                        Thumbnail Image <span className="text-red-500">*</span>
                      </Label>
                      <ImageUpload 
                        currentImage={formData.image} 
                        onImageUploaded={(url) => handleImageUploaded(url, 'image')} 
                        label="Upload Thumbnail Image"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This is the main image displayed in cards and at the top of the article
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="topImage">Top Image (Optional)</Label>
                        <ImageUpload 
                          currentImage={formData.topImage} 
                          onImageUploaded={(url) => handleImageUploaded(url, 'topImage')}
                          label="Upload Top Image"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="midImage">Mid-Article Image (Optional)</Label>
                        <ImageUpload 
                          currentImage={formData.midImage} 
                          onImageUploaded={(url) => handleImageUploaded(url, 'midImage')}
                          label="Upload Mid Image"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bottomImage">Bottom Image (Optional)</Label>
                        <ImageUpload 
                          currentImage={formData.bottomImage} 
                          onImageUploaded={(url) => handleImageUploaded(url, 'bottomImage')}
                          label="Upload Bottom Image"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Details</CardTitle>
                    <CardDescription>
                      Metadata and categorization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.categoryId} 
                        onValueChange={(value) => handleSelectChange("categoryId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                          <div 
                            key={tag} 
                            className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-2 py-1 rounded-full flex items-center text-sm"
                          >
                            <span>{tag}</span>
                            <button 
                              type="button" 
                              className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              onClick={() => removeTag(tag)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Enter tags (press Enter to add)"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Add relevant tags to help with search and categorization
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="featured">Feature this article</Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Featured articles appear in the carousel
                        </p>
                      </div>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Publishing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Review your article before publishing. Make sure all required fields are filled.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => navigate("/admin")}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary-dark text-white dark:bg-accent dark:hover:bg-accent-dark"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Publishing...
                        </>
                      ) : (
                        "Publish Article"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCreatePost;