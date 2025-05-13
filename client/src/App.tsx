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

function Router() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    scrollToTop();
  }, [location]);

  // Special log for debugging admin route
  useEffect(() => {
    if (location === '/admin') {
      console.log('On admin route - should render Dashboard component');
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/categories" component={CategoriesShowcase} />
          <Route path="/category/:slug" component={Category} />
          <Route path="/article/:slug" component={Article} />
          
          {/* Static routes */}
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/services" component={Services} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin/login" component={Login} />
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/create" component={CreatePost} />
          <Route path="/admin/edit/:id" component={EditPost} />
          <Route path="/admin/manage" component={ManagePosts} />
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
