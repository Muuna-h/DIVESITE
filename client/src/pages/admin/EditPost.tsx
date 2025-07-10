import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "wouter";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Article, Category } from "@shared/schema";
import ImageUpload from "@/components/ui/image-upload";
import { supabase } from "@/lib/supabase";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  email?: string;
}

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
    category_id: "",
    tags: [] as string[],
    featured: false
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch categories and article
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*");
      if (catError) {
        toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      setCategories(catData || []);

      // Fetch article
      const { data: artData, error: artError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      if (artError || !artData) {
        toast({ title: "Error", description: "Failed to load article.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      setArticle(artData);
      setFormData({
        title: artData.title,
        slug: artData.slug,
        summary: artData.summary,
        content: artData.content,
        image: artData.image || "",
        topImage: artData.topImage || "",
        midImage: artData.midImage || "",
        bottomImage: artData.bottomImage || "",
        category_id: artData.category_id?.toString() || "",
        tags: artData.tags || [],
        featured: artData.featured || false
      });
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

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

  const handleImageUploaded = (imageUrl: string, field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: imageUrl
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary || !formData.content || !formData.category_id) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase
      .from("articles")
      .update({
        ...formData,
        category_id: parseInt(formData.category_id),
      })
      .eq("id", id);
    setIsSubmitting(false);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Article updated successfully",
      });
      navigate(`/article/${formData.slug}`);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);
    setIsDeleting(false);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Article deleted successfully",
      });
      navigate("/admin/manage");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
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
              <Button variant="outline" onClick={() => navigate(`/article/${article?.slug}`)}>
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
                      Update article images
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">
                        Thumbnail Image
                      </Label>
                      <ImageUpload 
                        currentImage={formData.image} 
                        onImageUploaded={(url) => handleImageUploaded(url, 'image')}
                        label="Upload Thumbnail Image"
                      />
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
                        value={formData.category_id} 
                        onValueChange={(value) => handleSelectChange("category_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(categories) && categories.map(category => (
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
                            <p className="font-bold">{article?.views || 0}</p>
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                            <p className="font-bold">{article?.createdAt ? new Date(article.createdAt).toLocaleDateString() : '-'}</p>
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
