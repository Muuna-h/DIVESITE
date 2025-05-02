import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      const userData = await response.json();
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });
      
      console.log("Login successful, redirecting to dashboard", userData);
      
      // Add a small delay before redirect to ensure cookies are set
      setTimeout(() => {
        window.location.href = "/admin";  // Use direct navigation instead of setLocation
      }, 500);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password. Please try again.");
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Dive Tech</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center px-4 bg-secondary dark:bg-gray-800">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl font-bold mb-2">Admin Login</h1>
                <p className="text-gray-600 dark:text-gray-400">Sign in to access the dashboard</p>
              </div>
              
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input 
                    type="text" 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/" className="text-primary dark:text-accent hover:underline">
              ← Back to website
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
