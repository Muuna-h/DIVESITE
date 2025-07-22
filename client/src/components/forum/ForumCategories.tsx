import { forumCategories } from "../../../../shared/schema";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

const iconMap = Object.keys(solidIcons).reduce((acc, key) => {
  const iconName = key.replace(/fa/g, '').replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  acc[iconName] = (solidIcons as any)[key];
  return acc;
}, {} as { [key: string]: any });

export function ForumCategories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["forumCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as typeof forumCategories.$inferSelect[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Tech-themed animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Circuit pattern overlay */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0,50 L100,50 M50,0 L50,100 M25,25 L75,75 M75,25 L25,75" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                  <circle cx="50" cy="50" r="3" fill="rgba(0,200,255,0.2)" />
                  <circle cx="0" cy="0" r="2" fill="rgba(0,200,255,0.15)" />
                  <circle cx="100" cy="0" r="2" fill="rgba(0,200,255,0.15)" />
                  <circle cx="0" cy="100" r="2" fill="rgba(0,200,255,0.15)" />
                  <circle cx="100" cy="100" r="2" fill="rgba(0,200,255,0.15)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>
          {/* Animated glowing dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-teal-400 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-2/4 left-3/4 w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute top-1/3 left-2/3 w-4 h-4 rounded-full bg-indigo-400 animate-pulse opacity-30" style={{ animationDuration: '6s' }}></div>
        </div>
      </div>
      <div className="relative z-10">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <Link key={category.id} href={`/forum/categories/${category.slug}`}>
              <Card className="h-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-[0_0_15px_rgba(0,0,255,0.05)] rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,0,255,0.15)] hover:border-blue-400/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    {category.icon && iconMap[category.icon] && (
                      <FontAwesomeIcon icon={iconMap[category.icon]} className="text-2xl sm:text-3xl text-blue-400" />
                    )}
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 dark:text-gray-500 pt-1 text-sm sm:text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
