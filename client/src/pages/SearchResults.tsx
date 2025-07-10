import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Article } from "@shared/schema";
import { getCategoryName, getCategoryColor } from "@/lib/utils";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Always extract the query param from the actual URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
  }, [location]);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      supabase
        .from("articles")
        .select("id, slug, title, image, category_id, category:category_id (slug, name)")
        .ilike("title", `%${query}%`)
        .then(({ data, error }) => {
          console.log("Supabase search result:", { data, error });
          setArticles((data as unknown as Article[]) || []);
          setIsLoading(false);
        });
    } else {
      setArticles([]);
    }
  }, [query]);

  const handleArticleClick = (slug: string) => {
    setLocation(`/article/${slug}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-heading font-bold mb-6">
        Search results for <span className="text-primary">{`"${query}"`}</span>
      </h1>
      {isLoading ? (
        <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
          <i className="fas fa-spinner fa-spin text-3xl mb-2"></i>
          <p>Searching...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              ][article.categoryId - 1] ||
              "it";
            const categoryColors = getCategoryColor(categorySlug);
            const categoryName =
              article.category?.name || getCategoryName(categorySlug);

            return (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col"
                onClick={() => handleArticleClick(article.slug)}
              >
                <div className="h-48 w-full rounded-t-lg overflow-hidden">
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
                  <h2 className="font-heading font-bold text-lg mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      ) : query.length > 2 ? (
        <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
          <i className="fas fa-search-minus text-3xl mb-2"></i>
          <p>No results found for "{query}"</p>
        </div>
      ) : (
        <div className="text-gray-400 py-8 text-center">
          <p>Type at least 3 characters to search articles.</p>
        </div>
      )}
    </div>
  );
}