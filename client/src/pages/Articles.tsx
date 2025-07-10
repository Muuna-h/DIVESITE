import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Article } from "@shared/schema";
import { getCategoryName, getCategoryColor } from "@/lib/utils";
import Subscribe from "@/components/NewsletterSignup";

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    setIsLoading(true);
    supabase
      .from("articles")
      .select("id, slug, title, image, summary, category_id, category:category_id (slug, name)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setArticles((data as unknown as Article[]) || []);
        setIsLoading(false);
      });
  }, []);

  const handleArticleClick = (slug: string) => {
    setLocation(`/article/${slug}`);
  };

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8 text-blue-700 dark:text-green-400">
          All Articles
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-green-400"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article) => {
              const categorySlug =
                article.category?.slug ||
                [
                  "it",
                  "software",
                  "hardware",
                  "emerging",
                  "green",
                  "media",
                  "communication",
                  "jobs",
                  "reviews",
                ][article.category_id - 1] ||
                "it";
              const categoryColors = getCategoryColor(categorySlug);
              const categoryName =
                article.category?.name || getCategoryName(categorySlug);

              return (
                <div
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col border border-blue-100 dark:border-green-900"
                  onClick={() => handleArticleClick(article.slug)}
                >
                  <div className="h-44 w-full rounded-t-2xl overflow-hidden">
                    <img
                      src={
                        article.image ||
                        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <span
                      className={`mb-2 inline-block text-xs font-semibold rounded ${categoryColors.bg} ${categoryColors.text} px-2 py-1`}
                    >
                      {categoryName}
                    </span>
                    <h2 className="font-heading font-bold text-lg mb-2 line-clamp-2 text-blue-700 dark:text-green-400">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <i className="fas fa-newspaper text-4xl mb-2"></i>
            <p>No articles found.</p>
          </div>
        )}

        {/* Subscribe component at the bottom */}
        <div className="mt-14">
          <Subscribe />
        </div>
      </div>
    </div>
  );
}