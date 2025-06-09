// components/Login.tsx

import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/lib/uselogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Login failed",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      await login.mutateAsync({ email, password });

      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });

      setLocation("/admin");
    } catch (err) {
      let msg = "Invalid email or password";
      if (err instanceof Error) {
        if (err.message.includes("Admin access")) {
          msg = "This account does not have admin access";
        }
      }

      toast({
        title: "Login failed",
        description: msg,
        variant: "destructive",
      });
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

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  disabled={login.isPending}
                >
                  {login.isPending ? (
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
