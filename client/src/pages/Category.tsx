import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
import { Category as CategoryType, Article } from "@shared/schema";
import { supabase } from "@/lib/supabase";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery<CategoryType>({
    queryKey: ["category", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, icon, gradient, image, imageAlt, thumbnailImage, bannerImage, imageMetadata")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Supabase category error:", error);
        throw new Error(error.message);
      }
      if (!data) throw new Error("Category not found");
      return data;
    },
    retry: 2,
  });

  const {
    data: articles,
    isLoading: isArticlesLoading,
    isError: isArticlesError,
  } = useQuery<Article[]>({
    queryKey: ["articles", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, category:categories(*), author:users(*)")
        .eq("category_id", category?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase articles error:", error);
        throw new Error(error.message);
      }
      return data || [];
    },
    retry: 2,
  });

  const isLoading = isCategoryLoading || isArticlesLoading;
  const isError = isCategoryError || isArticlesError;

  if (isLoading) {
    return (
      <div className="pt-16 pb-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent dark:border-accent dark:border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading category...</p>
        </div>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="pt-16 pb-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
          <h3 className="font-heading text-2xl font-bold mb-2">Category Not Found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            The category you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} - Dive Tech</title>
        <meta
          name="description"
          content={`Explore the latest articles on ${category.name}: ${category.description}`}
        />
        <meta property="og:title" content={`${category.name} - Dive Tech`} />
        <meta
          property="og:description"
          content={`Explore the latest articles on ${category.name}: ${category.description}`}
        />
      </Helmet>

      <div className="pt-16 pb-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
              style={{ background: category.gradient || "#3b82f6" }}
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className={`fas ${category.icon || "fa-folder"} text-white text-4xl`}></i>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">{category.description}</p>
            </div>
          </div>

          {articles && articles.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {articles.map((article) => (
                <motion.div key={article.id} variants={item}>
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-12 text-center">
              <i className="fas fa-folder-open text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
              <h3 className="font-heading text-2xl font-bold mb-2">No Articles Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We haven't published any articles in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Category;
