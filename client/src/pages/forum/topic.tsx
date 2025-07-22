import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRoute } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const replySchema = z.object({
  content: z.string().min(1, "Reply cannot be empty"),
});

type Reply = {
  id: number;
  content: string;
  author_id: number;
  created_at: string;
  isSolution: boolean;
  author: {
    username: string;
    avatar: string;
  };
};

type Topic = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  views: number;
  isLocked: boolean;
  author: {
    username: string;
    avatar: string;
  };
  category: {
    name: string;
    slug: string;
  };
  replies: Reply[];
};

export default function TopicPage() {
  const [, params] = useRoute<{ slug: string }>("/forum/topics/:slug");
  const { isAuthenticated } = useSupabaseAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const fetchTopic = async () => {
      if (!params?.slug) return;

      try {
        const { data, error } = await supabase
          .from("forum_topics")
          .select(`
            *,
            author:users (username, avatar),
            category:forum_categories (name, slug),
            replies:forum_replies (
              id,
              content,
              author_id,
              created_at,
              is_solution,
              author:users (username, avatar)
            )
          `)
          .eq("slug", params.slug)
          .single();

        if (error) throw error;
        setTopic(data);
      } catch (error) {
        console.error("Error fetching topic:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [params?.slug]);

  async function onSubmit(values: z.infer<typeof replySchema>) {
    if (!topic) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) return;

    try {
      // Replace fetch with direct Supabase query
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.session.user.email)
        .single();

      if (!userData) throw new Error("User not found");

      const { data: newReply, error } = await supabase
        .from('forum_replies')
        .insert({
          content: values.content,
          topicid: topic.id,
          author_id: userData.id,
        })
        .select('*, author:users(*)')
        .single();

      if (error) throw error;

      setTopic((prev) => prev ? {
        ...prev,
        replies: [...prev.replies, newReply],
      } : null);

      form.reset();
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return <div className="container py-8">Topic not found</div>;
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
        <Card className="mb-8 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-[0_0_15px_rgba(0,0,255,0.1)] rounded-xl overflow-hidden">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-2 sm:mb-0">
                  {topic.title}
                  {topic.isLocked && (
                    <Badge variant="outline" className="border-orange-400/50 bg-orange-400/10 text-orange-400">
                      <span className="mr-1">🔒</span> Locked
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">
                  <MessageCircle className="h-4 w-4" />
                  {topic.replies.length} replies
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mt-3">
                Posted in{" "}
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/50">
                  {topic.category.name}
                </Badge>{" "}
                by{" "}
                <span className="text-blue-400 font-medium">{topic.author.username}</span>{" "}
                <span className="text-gray-500">
                  {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              {topic.content}
            </div>
          </CardContent>
        </Card>

        {topic.replies.length > 0 && (
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Discussions
            </h2>
            <Separator className="mb-4 bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
            {topic.replies.map((reply) => (
              <Card key={reply.id} className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-[0_0_10px_rgba(0,0,255,0.05)] transform transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,0,255,0.1)]">
                <CardContent className="pt-6">
                  <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-500/30">
                        <AvatarImage src={reply.author.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {reply.author.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-blue-500">
                          {reply.author.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(reply.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    {reply.isSolution && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/50">
                        <span className="mr-1">✓</span> Solution
                      </Badge>
                    )}
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    {reply.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isAuthenticated && !topic.isLocked && (
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-[0_0_15px_rgba(0,0,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Join the Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  className="min-h-[120px] bg-white/50 dark:bg-gray-800/50 backdrop-blur border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none rounded-lg"
                  {...form.register("content")}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.content.message}
                  </p>
                )}
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Post Reply
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
