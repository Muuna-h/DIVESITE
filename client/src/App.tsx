import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Category from "@/pages/Category";
import Article from "@/pages/Article";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Profile from "@/pages/Profile";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import CreatePost from "@/pages/admin/CreatePost";
import EditPost from "@/pages/admin/EditPost";
import ManagePosts from "@/pages/admin/ManagePosts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { scrollToTop } from "@/utils/navigation";
import Services from "@/pages/Services";
import CategoriesShowcase from "@/components/CategoriesShowcase";
import AuthGuard from "@/components/AuthGuard";

function Router() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    scrollToTop();
  }, [location]);

  // Debug log for admin route
  useEffect(() => {
    if (location === "/admin") {
      console.log("On admin route - should render Dashboard component");
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      <main className="flex-grow">
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/categories" component={CategoriesShowcase} />
          <Route path="/category/:slug" component={Category} />
          <Route path="/article/:slug" component={Article} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/services" component={Services} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin/login" component={Login} />

          {/* Protected Admin Routes */}
          <Route path="/admin" component={() => (
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          )} />
          <Route path="/admin/create" component={() => (
            <AuthGuard>
              <CreatePost />
            </AuthGuard>
          )} />
          <Route path="/admin/edit/:id" component={() => (
            <AuthGuard>
              <EditPost />
            </AuthGuard>
          )} />
          <Route path="/admin/manage" component={() => (
            <AuthGuard>
              <ManagePosts />
            </AuthGuard>
          )} />

          {/* Fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  );
}

export default App;
