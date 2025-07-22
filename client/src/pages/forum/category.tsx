import { TopicsList } from "@/components/forum/TopicsList";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import { PlusCircle } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function CategoryTopicsPage() {
  const [, params] = useRoute<{ categorySlug: string }>("/forum/categories/:categorySlug");
  const categorySlug = params?.categorySlug;
  const { isAuthenticated } = useSupabaseAuth();

  if (!categorySlug) return null;

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
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 pb-2 capitalize">
              {categorySlug.replace(/-/g, " ")}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Browse topics in this category
            </p>
          </div>
          {isAuthenticated && (
            <Link href={`/forum/new-topic?category=${categorySlug}`}>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </Link>
          )}
        </div>
        <TopicsList categorySlug={categorySlug} />
      </div>
    </div>
  );
}
