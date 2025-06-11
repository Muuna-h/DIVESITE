import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Article, ContactMessage, SiteStat, Subscriber, Category } from "@shared/schema";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, Loader2, AlertCircle } from "lucide-react";

// Interface for aggregated stats (matching backend)
interface SiteStatsAggregate {
  totalPageViews: number;
  totalUniqueVisitors: number;
  avgBounceRate: number;
  avgSessionDuration: number;
}

// Interface for the API response from /api/admin/stats
interface SiteStatsComparisonResponse {
  current: SiteStatsAggregate | null;
  previous: SiteStatsAggregate | null;
}

// Define the type for user data response
interface UserData {
  user: {
    id: number;
    username: string;
    name: string | null;
    role: string | null;
    email?: string | null;
    bio?: string | null;
    avatar?: string | null;
  }
}

// Add interface for view response
interface ViewCountResponse {
  success: boolean;
  views: number;
}

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number | null, previous: number | null): number | null => {
  if (previous === null || previous === 0 || current === null) {
    return null; 
  }
  if (previous === 0) return null; 
  return ((current - previous) / previous) * 100;
};

const AdminDashboard = () => {
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Refs for potential future use (removed from animation logic)
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const tableRef = useRef(null);
  const messagesRef = useRef(null);
  
  // Function to safely format dates
  const safeFormatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  // Function to safely compare dates for sorting
  const compareDates = (dateA: Date | string | null, dateB: Date | string | null): number => {
    if (!dateA && !dateB) return 0;
    if (!dateA) return -1;
    if (!dateB) return 1;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  };

  // Function to safely get view count - adding the same approach from ManagePosts
  const getViews = (views: number | null): number => {
    return views ?? 0; // Null coalescing operator to default to 0 if null
  };

  // Query for the current user
  const { data: userData, isLoading: isUserLoading, error: userError } = useQuery<UserData>({
    queryKey: ['/api/auth/me'],
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    console.log("Auth check - userData:", JSON.stringify(userData));
    
    if (userError) {
      console.error("Authentication error:", userError);
      navigate("/admin/login");
      return;
    }
    
    if (!userData?.user) {
      console.log("No user data found, waiting...");
      return; // Wait for data to load
    }
    
    console.log("User role check:", userData.user.role);
    
    // Check for null, undefined, or non-admin role
    // Some database entries might have role as null instead of a string
    if (userData.user.role !== "admin") {
      console.error("Not an admin user, current role:", userData.user.role || "null/undefined");
      alert("You need administrator privileges to access this page");
      
      // Don't redirect immediately, wait a moment to see logs
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      console.log("Successfully authenticated as admin!");
    }
  }, [userData, userError, navigate]);

  // Fetch dashboard data
  const { data: articlesData, error: articlesError } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    enabled: !!userData,
  });

  const { data: messages, error: messagesError } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/messages'],
    enabled: !!userData,
  });

  const { data: subscribers, error: subscribersError } = useQuery<Subscriber[]>({
    queryKey: ['/api/admin/subscribers'],
    enabled: !!userData,
  });

  // Add query for categories - Request full details for admin
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories?includeDetails=true'], // Request full details
    enabled: !!userData,
  });

  // Fetch dashboard STATS comparison data
  const { data: statsComparison, error: statsError } = useQuery<SiteStatsComparisonResponse>({
    queryKey: ['/api/admin/stats'], // Matches the updated API endpoint
    enabled: !!userData,
  });

  // Log data loading states for debugging
  useEffect(() => {
    console.log("Articles data:", articlesData?.length || 0, "items", articlesError ? "Error: " + articlesError : "");
    console.log("Messages data:", messages?.length || 0, "items", messagesError ? "Error: " + messagesError : "");
    console.log("Subscribers data:", subscribers?.length || 0, "items", subscribersError ? "Error: " + subscribersError : "");
    // Log the new stats structure
    console.log("Stats Comparison data:", JSON.stringify(statsComparison), statsError ? "Error: " + statsError : ""); 
  }, [articlesData, messages, subscribers, statsComparison, articlesError, messagesError, subscribersError, statsError]);

  // Use direct data, default stats to 0
  const currentStats = statsComparison?.current ?? { totalPageViews: 0, totalUniqueVisitors: 0, avgBounceRate: 0, avgSessionDuration: 0 };
  
  // Calculate percentage change for Page Views (6 months)
  const pageViewsChange = calculatePercentageChange(
    statsComparison?.current?.totalPageViews ?? null, 
    statsComparison?.previous?.totalPageViews ?? null 
  );

  // Logout handler
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        alert("Logout failed. Please try again.");
      } else {
        // Invalidate user query to reflect logout status
        queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        // Redirect to login page after successful logout
        navigate("/admin/login");
        console.log("Logout successful");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // Add state for tracking total views
  const [totalViews, setTotalViews] = useState<number>(0);
  
  // Add effect to calculate total views from articles data
  useEffect(() => {
    if (articlesData && articlesData.length > 0) {
      // Sum up all article views, defaulting to 0 for null values (same as ManagePosts)
      const viewsSum = articlesData.reduce((sum, article) => sum + getViews(article.views), 0);
      setTotalViews(viewsSum);
      
      console.log("Total article views calculated:", viewsSum);
    }
  }, [articlesData]);

  // Add function to get top viewed articles
  const getTopViewedArticles = () => {
    if (!articlesData) return [];
    
    // Sort articles by views, handling null views (same approach as ManagePosts)
    return [...articlesData]
      .sort((a, b) => {
        const viewsA = getViews(a.views);
        const viewsB = getViews(b.views);
        return viewsB - viewsA; // Sort by descending views
      })
      .slice(0, 5); // Get top 5 articles
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="ml-3 text-lg font-medium">Loading dashboard...</div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 dark:bg-red-900 text-black dark:text-white p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">You must be logged in as an admin to view this page.</p>
          <button 
            onClick={() => navigate("/admin/login")} 
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Format data for charts - Add checks for articlesData
  const categoryCounts = articlesData?.reduce((acc, article) => {
    const categoryName = article.category?.name || "Uncategorized";
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = categoryCounts ? Object.keys(categoryCounts).map(category => ({
    name: category,
    value: categoryCounts[category]
  })) : [];

  const viewsData = articlesData?.sort((a, b) => getViews(b.views) - getViews(a.views))
    .slice(0, 5).map(article => ({
      name: article.title.length > 20 ? article.title.substring(0, 20) + '...' : article.title,
      views: getViews(article.views)
    })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Get recent messages - Add check for messages data
  const recentMessages = messages?.sort((a, b) => compareDates(a.createdAt, b.createdAt))
    .slice(0, 5) || [];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Dive Tech</title>
      </Helmet>

      <div className="bg-blue-50 dark:bg-slate-900 min-h-screen py-8">
        <div className="mx-auto max-w-4xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="flex items-center p-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">Welcome to Admin Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">You are logged in as {userData.user?.username} with admin privileges</p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl font-bold font-heading text-black dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {userData.user?.name || userData.user?.username}
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2 flex items-center">
              <RouterLink href="/admin/create" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center text-sm">
                <i className="fas fa-plus mr-2"></i> New Article
              </RouterLink>
              <RouterLink href="/admin/manage" className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white px-4 py-2 rounded-lg inline-flex items-center text-sm">
                <i className="fas fa-list mr-2"></i> Manage Content
              </RouterLink>
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-flex items-center text-sm"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </button>
            </div>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Stats cards - Use direct data lengths or 0 */}
              <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div>
                  <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{articlesData?.length || 0}</div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div>
                  <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Page Views (Articles)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{totalViews}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {articlesData?.length || 0} total articles
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div>
                  <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{subscribers?.length || 0}</div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div>
                  <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">New Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Check messages data before filtering */}
                      <div className="text-3xl font-bold">{messages?.filter(message => !message.read).length || 0}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{messages?.length || 0} total messages</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Charts - Already check data length before rendering */}
              <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {/* Articles by Category Pie Chart */}
                 <Card className="col-span-1 bg-white dark:bg-gray-800 shadow-lg"> 
                    <CardHeader>
                      <CardTitle>Articles by Category</CardTitle>
                      <CardDescription>Distribution of content across categories</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80"> 
                       <ResponsiveContainer width="100%" height="100%"> 
                          {categoryData.length > 0 ? (
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">No category data available</div>
                          )}
                       </ResponsiveContainer> 
                    </CardContent> 
                 </Card> 
                 {/* Top Performing Articles Bar Chart */}
                 <Card className="col-span-1 bg-white dark:bg-gray-800 shadow-lg"> 
                    <CardHeader>
                      <CardTitle>Top Performing Articles</CardTitle>
                      <CardDescription>Articles with the most views (Top 5)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80"> 
                       <ResponsiveContainer width="100%" height="100%"> 
                          {viewsData.length > 0 ? (
                            <BarChart data={viewsData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="name" width={150} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="views" fill="#8884d8" />
                            </BarChart>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">No article view data available</div>
                          )}
                       </ResponsiveContainer> 
                    </CardContent> 
                 </Card>
              </motion.div>

              <motion.div>
                <Card className="bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Site Page Views (Last 6 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{currentStats.totalPageViews}</div>
                    {pageViewsChange !== null && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className={pageViewsChange >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                          <i className={`fas ${pageViewsChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
                          {Math.abs(pageViewsChange).toFixed(1)}%
                        </span>
                        {" "}from previous 6 months
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles">
              <h2 className="text-2xl font-bold mb-4">Top Articles by Views</h2>
              {articlesData ? (
                <div>
                  {getTopViewedArticles().length > 0 ? (
                    <div className="space-y-4">
                      {getTopViewedArticles().map((article) => (
                        <Card key={article.id} className="bg-white dark:bg-gray-800 shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <h3 className="font-medium truncate">{article.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm flex items-center">
                                  <EyeIcon className="h-3.5 w-3.5 mr-1" />
                                  {getViews(article.views).toLocaleString()}
                                </div>
                                <RouterLink href={`/admin/posts/edit/${article.id}`}>
                                  <Button size="sm" variant="outline">
                                    <PencilIcon className="h-3.5 w-3.5" />
                                  </Button>
                                </RouterLink>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No articles found. Create your first article to see stats.
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              {/* Add content for analytics tab */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
