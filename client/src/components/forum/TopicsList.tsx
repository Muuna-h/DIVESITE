import { forumTopics } from "../../../../shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageCircle, Pin } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";

interface TopicsListProps {
  categorySlug: string;
}

export function TopicsList({ categorySlug }: TopicsListProps) {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["forumTopics", categorySlug],
    queryFn: async () => {
      // First get the category id
      const { data: category, error: categoryError } = await supabase
        .from('forum_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (categoryError || !category) throw new Error("Category not found");

      // Then get the topics with author and reply count
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:users (username, avatar),
          replies:forum_replies (id)
        `)
        .eq('categoryid', category.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to include reply count
      return data.map(topic => ({
        ...topic,
        replies: topic.replies || [],
      })) as (typeof forumTopics.$inferSelect & {
        author: { username: string; avatar: string };
        replies: any[];
      })[];
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
      <div className="relative z-10 space-y-4">
        {topics?.map((topic) => (
          <Link key={topic.id} href={`/forum/topics/${topic.slug}`}>
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-[0_0_15px_rgba(0,0,255,0.05)] rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,0,255,0.15)] hover:border-blue-400/50">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    {topic.isPinned && (
                      <Pin className="h-4 w-4 text-orange-400" />
                    )}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                      {topic.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                    <MessageCircle className="h-4 w-4" />
                    {topic.replies.length} replies
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <Avatar className="h-6 w-6 ring-1 ring-blue-500/50">
                      <AvatarImage src={topic.author.avatar} />
                      <AvatarFallback>
                        {topic.author.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-blue-400">
                      {topic.author.username}
                    </span>
                  </div>
                  <span>
                    {formatDistanceToNow(
                      new Date(topic.createdAt ?? Date.now()),
                      { addSuffix: true }
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
