import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Article, Category } from "@shared/schema";
import { getCategoryColor } from "@/lib/utils";

// Define the expected shape of the user data from the API
interface UserResponse {
  user: {
    id: number;
    username: string;
    name?: string | null;
    role?: string | null;
    // Add other fields if needed
  } | null;
}

const AdminManagePosts = () => {
  const [_, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Query for the current user with explicit type
  const { data: userData, isLoading: isUserLoading, error: userError } = useQuery<UserResponse>({
    queryKey: ['/api/auth/me'],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (userError) {
      navigate("/admin/login");
    }
  }, [userError, navigate]);

  // Fetch articles
  const { data: articles, isLoading: isArticlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    enabled: !!userData,
  });

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    enabled: !!userData,
  });

  // Filter and sort articles
  const filteredArticles = articles?.filter(article => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || article.categoryId.toString() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    // Handle potential null dates by defaulting to epoch (0) or a very distant date
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    
    // Handle potential null views by defaulting to 0
    const viewsA = a.views ?? 0;
    const viewsB = b.views ?? 0;

    if (sortBy === "newest") {
      return dateB - dateA;
    } else if (sortBy === "oldest") {
      return dateA - dateB;
    } else if (sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    } else if (sortBy === "most-views") {
      return viewsB - viewsA;
    }
    return 0;
  });

  if (isUserLoading || isArticlesLoading || isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData?.user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Helmet>
        <title>Manage Articles - Dive Tech</title>
      </Helmet>

      <div className="bg-secondary dark:bg-gray-800 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Manage Articles</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Total: {articles?.length || 0} articles
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <i className="fas fa-arrow-left mr-2"></i> Dashboard
              </Button>
              <Button onClick={() => navigate("/admin/create")} className="bg-primary hover:bg-primary-dark text-white dark:bg-accent dark:hover:bg-accent-dark">
                <i className="fas fa-plus mr-2"></i> New Article
              </Button>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filter Articles</CardTitle>
              <CardDescription>
                Find and sort articles by different criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-1">
                    Search
                  </label>
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by title, content, or tags"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium mb-1">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      <SelectItem value="most-views">Most Views</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 hidden md:table-cell">Date</th>
                    <th className="py-3 px-4 hidden md:table-cell">Views</th>
                    <th className="py-3 px-4 hidden md:table-cell">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedArticles.length > 0 ? (
                    sortedArticles.map(article => {
                      const categorySlug = article.category?.slug || 
                        ["it", "software", "hardware", "emerging", "green", "media", "communication", "jobs", "reviews"][article.categoryId - 1] || 
                        "it";
                      const categoryColors = getCategoryColor(categorySlug);
                      
                      return (
                        <tr key={article.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="truncate max-w-[150px] sm:max-w-xs">
                                <span className="font-medium">{article.title}</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {article.summary.substring(0, 60)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium px-2 py-1 rounded-full`}>
                              {article.category?.name || "Unknown"}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            {/* Handle null date for display */}
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            {article.views ?? 0} {/* Handle null views for display */}
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            {article.featured ? (
                              <span className="text-green-500 dark:text-green-400">
                                <i className="fas fa-check-circle"></i>
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-600">
                                <i className="fas fa-times-circle"></i>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <i className="fas fa-ellipsis-v"></i>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link href={`/admin/edit/${article.id}`}>
                                    <span className="flex items-center w-full">
                                      <i className="fas fa-edit mr-2"></i> Edit
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/article/${article.slug}`}>
                                    <span className="flex items-center w-full">
                                      <i className="fas fa-eye mr-2"></i> View
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm || categoryFilter !== "all" ? (
                          <>
                            <i className="fas fa-search text-4xl mb-3"></i>
                            <p>No articles match your filters</p>
                            <button 
                              className="text-primary dark:text-accent hover:underline mt-2" 
                              onClick={() => {
                                setSearchTerm("");
                                setCategoryFilter("all");
                              }}
                            >
                              Clear filters
                            </button>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-alt text-4xl mb-3"></i>
                            <p>No articles yet</p>
                            <Link href="/admin/create">
                              <a className="text-primary dark:text-accent hover:underline mt-2">
                                Create your first article
                              </a>
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminManagePosts;
