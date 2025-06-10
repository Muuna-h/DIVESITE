import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [_, setLocation] = useLocation();

  // Function to check authentication and admin role
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setIsAuthorized(false);
      setLocation("/admin/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || profile?.role !== "admin") {
      setIsAuthorized(false);
      setLocation("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  };

  useEffect(() => {
    checkAuth(); // Initial check on mount

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    // Cleanup listener on unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (isAuthorized === null) return <div className="p-4 text-center">Checking access...</div>;
  if (!isAuthorized) return null;

  return <>{children}</>;
};

export default AuthGuard;
