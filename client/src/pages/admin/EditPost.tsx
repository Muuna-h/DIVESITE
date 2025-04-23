import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "wouter";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Article, Category } from "@shared/schema";

const AdminEditPost = () => {
  const { id } = useParams<{ id: string }>();
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for the current user
  const { data: userData, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  // Query for categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    enabled: !!userData,
  });

  // Query for article data
  const { data: article, isLoading: isArticleLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
    enabled: !!userData && !!id,
  });

  // Update article mutation
  const updateArticle = useMutation({
    mutationFn: (articleData: typeof formData) => {
      return apiRequest("PUT", `/api/articles/${id}`, articleData);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Success!",
        description: "Article updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/featured'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/latest'] });
      navigate(`/article/${data.slug}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  // Delete article mutation
  const deleteArticle = useMutation({
    mutationFn: () => {
      return apiRequest("DELETE", `/api/articles/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Article deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/featured'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/latest'] });
      navigate("/admin/manage");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (userError) {
      navigate("/admin/login");
    }
  }, [userError, navigate]);

  // Populate form data when article is loaded
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        image: article.image,
        topImage: article.topImage || "",
        midImage: article.midImage || "",
        bottomImage: article.bottomImage || "",
        categoryId: article.categoryId.toString(),
        tags: article.tags || [],
        featured: article.featured
      });
    }
  }, [article]);

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
    
    if (name === "title" && formData.slug === generateSlug(formData.title)) {
      // Only auto-update slug if it hasn't been manually changed
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
    
    updateArticle.mutate(submitData);
  };

  // Handle delete
  const handleDelete = () => {
    setIsDeleting(true);
    deleteArticle.mutate();
  };

  if (isUserLoading || isCategoriesLoading || isArticleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData || !userData.user) {
    return null; // Will redirect in useEffect
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-lg">
          <i className="fas fa-file-alt text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
          <h2 className="font-heading text-2xl font-bold mb-2">Article Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The article you're trying to edit doesn't exist or may have been removed.
          </p>
          <Button onClick={() => navigate("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Article - Dive Tech</title>
      </Helmet>

      <div className="bg-secondary dark:bg-gray-800 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-heading">Edit Article</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => navigate("/admin/manage")}>
                <i className="fas fa-arrow-left mr-2"></i> Back to Articles
              </Button>
              <Button variant="outline" onClick={() => navigate(`/article/${article.slug}`)}>
                <i className="fas fa-eye mr-2"></i> View Article
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                    <CardDescription>
                      Edit your article content
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
                        This will be used in the article URL
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
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your article content here..."
                        rows={15}
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        You can use HTML for formatting. For links, use &lt;a href="..."&gt;link text&lt;/a&gt;
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>
                      Update article images
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">
                        Thumbnail Image <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This is the main image displayed in cards and at the top of the article
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="topImage">Top Image (Optional)</Label>
                        <Input
                          id="topImage"
                          name="topImage"
                          value={formData.topImage}
                          onChange={handleChange}
                          placeholder="Enter image URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="midImage">Mid-Article Image (Optional)</Label>
                        <Input
                          id="midImage"
                          name="midImage"
                          value={formData.midImage}
                          onChange={handleChange}
                          placeholder="Enter image URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bottomImage">Bottom Image (Optional)</Label>
                        <Input
                          id="bottomImage"
                          name="bottomImage"
                          value={formData.bottomImage}
                          onChange={handleChange}
                          placeholder="Enter image URL"
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
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Review your article before updating. Make sure all required fields are filled.
                        </p>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-1">Article Stats</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                            <p className="font-bold">{article.views}</p>
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                            <p className="font-bold">{new Date(article.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                          {isDeleting ? "Deleting..." : "Delete Article"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the article
                            and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Yes, delete article
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
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
                          Updating...
                        </>
                      ) : (
                        "Update Article"
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

export default AdminEditPost;
