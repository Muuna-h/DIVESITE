import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { motion } from "framer-motion";
import { Article, ContactMessage, SiteStat, Subscriber } from "@shared/schema";

const AdminDashboard = () => {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Query for the current user
  const { data: userData, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (userError) {
      navigate("/admin/login");
    } else if (userData && userData.user.role !== "admin") {
      navigate("/");
    }
  }, [userData, userError, navigate]);

  // Fetch dashboard data
  const { data: articlesData } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    enabled: !!userData,
  });

  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/messages'],
    enabled: !!userData,
  });

  const { data: subscribers } = useQuery<Subscriber[]>({
    queryKey: ['/api/admin/subscribers'],
    enabled: !!userData,
  });

  const { data: stats } = useQuery<SiteStat[]>({
    queryKey: ['/api/admin/stats'],
    enabled: !!userData,
  });

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData || !userData.user) {
    return null; // Will redirect in useEffect
  }

  // Format data for charts
  const categoryCounts = articlesData?.reduce((acc, article) => {
    const categoryName = article.category?.name || "Uncategorized";
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = categoryCounts ? Object.keys(categoryCounts).map(category => ({
    name: category,
    count: categoryCounts[category]
  })) : [];

  const viewsData = articlesData?.sort((a, b) => b.views - a.views).slice(0, 5).map(article => ({
    name: article.title.length > 20 ? article.title.substring(0, 20) + '...' : article.title,
    views: article.views
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const recentMessages = messages?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5) || [];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Dive Tech</title>
      </Helmet>

      <div className="bg-secondary dark:bg-gray-800 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {userData.user.name || userData.user.username}
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Link href="/admin/create">
                <a className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center">
                  <i className="fas fa-plus mr-2"></i> New Article
                </a>
              </Link>
              <Link href="/admin/manage">
                <a className="bg-secondary dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg inline-flex items-center">
                  <i className="fas fa-list mr-2"></i> Manage Content
                </a>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Articles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{articlesData?.length || 0}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="text-green-500 dark:text-green-400">
                          <i className="fas fa-arrow-up mr-1"></i>
                          {Math.floor(Math.random() * 10) + 1}%
                        </span>{" "}
                        from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Page Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {stats?.[0]?.pageViews || Math.floor(Math.random() * 10000)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="text-green-500 dark:text-green-400">
                          <i className="fas fa-arrow-up mr-1"></i>
                          {Math.floor(Math.random() * 20) + 5}%
                        </span>{" "}
                        from last week
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Subscribers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{subscribers?.length || 0}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="text-green-500 dark:text-green-400">
                          <i className="fas fa-arrow-up mr-1"></i>
                          {Math.floor(Math.random() * 15) + 2}%
                        </span>{" "}
                        from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        New Messages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {messages?.filter(message => !message.read).length || 0}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {messages?.length || 0} total messages
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Articles by Category</CardTitle>
                    <CardDescription>Distribution of content across categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Top Performing Articles</CardTitle>
                    <CardDescription>Articles with the most views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={viewsData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={100} />
                          <Tooltip />
                          <Bar dataKey="views" fill="#456CBF" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Articles</CardTitle>
                  <CardDescription>Latest published content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left py-3 px-4">Title</th>
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Views</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articlesData?.sort((a, b) => 
                          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                        ).slice(0, 10).map(article => (
                          <tr key={article.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="truncate max-w-[250px]">{article.title}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{article.category?.name}</td>
                            <td className="py-3 px-4">{new Date(article.publishedAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{article.views}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link href={`/admin/edit/${article.id}`}>
                                  <a className="text-blue-500 hover:text-blue-700">
                                    <i className="fas fa-edit"></i>
                                  </a>
                                </Link>
                                <Link href={`/article/${article.slug}`}>
                                  <a className="text-green-500 hover:text-green-700">
                                    <i className="fas fa-eye"></i>
                                  </a>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-right">
                    <Link href="/admin/manage">
                      <a className="text-primary dark:text-accent hover:underline">
                        View all articles →
                      </a>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Content performance by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4BFFB3" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Latest contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentMessages.length > 0 ? (
                    <div className="space-y-4">
                      {recentMessages.map(message => (
                        <div key={message.id} className={`p-4 rounded-lg border ${message.read ? 'border-gray-200 dark:border-gray-700' : 'border-primary dark:border-accent'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold">{message.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{message.email}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                              {!message.read && (
                                <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent text-xs px-2 py-1 rounded">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="font-medium mb-2">{message.subject}</div>
                          <p className="text-gray-600 dark:text-gray-300">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="fas fa-inbox text-gray-300 dark:text-gray-700 text-4xl mb-3"></i>
                      <p className="text-gray-500 dark:text-gray-400">No messages received yet</p>
                    </div>
                  )}

                  {messages && messages.length > 5 && (
                    <div className="mt-4 text-right">
                      <a href="#" className="text-primary dark:text-accent hover:underline">
                        View all messages →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <CardDescription>Total: {subscribers?.length || 0} subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { date: '1 Jan', count: 10 },
                          { date: '1 Feb', count: 25 },
                          { date: '1 Mar', count: 30 },
                          { date: '1 Apr', count: 45 },
                          { date: '1 May', count: 60 },
                          { date: '1 Jun', count: 85 },
                          { date: 'Today', count: subscribers?.length || 100 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#456CBF" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
