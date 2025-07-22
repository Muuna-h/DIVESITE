import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare, BookType, Folder } from "lucide-react";
import { createSlug } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  categoryId: z.string().min(1, "Please select a category"),
});

export default function NewTopicPage() {
  const { isAuthenticated, isLoading: authLoading } = useSupabaseAuth();
  const [, navigate] = useLocation();

  // Fetch categories for the dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["forumCategories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("forum_categories")
        .select("*")
        .order("name");
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });

  // In the createTopic mutation function, replace the fetch call with direct Supabase query
  const createTopic = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error("Not authenticated");
      }
  
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.session.user.email)
        .single();
  
      if (!userData) {
        throw new Error("User not found");
      }
  
      const slug = createSlug(values.title);
  
      // Replace fetch with direct Supabase query
      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          title: values.title,
          content: values.content,
          categoryId: parseInt(values.categoryId),
          authorId: userData.id,
          slug: slug
        })
        .select('*, author:users(*)')
        .single();
  
      if (error) throw new Error("Failed to create topic");
      return data;
    },
    onSuccess: (topic) => {
      navigate(`/forum/topics/${topic.slug}`);
    },
  });

  if (authLoading || categoriesLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createTopic.mutate(values);
  }

  return (
    <div className="container py-8 relative min-h-[calc(100vh-80px)] flex items-center justify-center">
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
      <Card className="w-full max-w-md md:max-w-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-[0_0_25px_rgba(0,0,255,0.1)] rounded-xl overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Start a New Discussion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-400 text-sm md:text-base"><BookType className="mr-2 h-4 w-4"/>Title</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="What's on your mind?" {...field} className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg" />
                        <BookType className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-400"><Folder className="mr-2 h-4 w-4"/>Category</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          className="w-full rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur px-3 py-2 pl-10 appearance-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                          {...field}
                        >
                          <option value="">Select a category</option>
                          {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <Folder className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-400"><MessageSquare className="mr-2 h-4 w-4"/>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts in detail..."
                        className="min-h-[200px] bg-white/50 dark:bg-gray-800/50 backdrop-blur border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                disabled={createTopic.isPending}
              >
                {createTopic.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit Topic
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
