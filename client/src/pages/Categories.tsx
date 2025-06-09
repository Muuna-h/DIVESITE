import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import CategoryCard from "@/components/CategoryCard";
import { Category } from "@shared/schema";
import { supabase } from "@/lib/supabase";

const Categories = () => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, icon, gradient, image, imageAlt, thumbnailImage, bannerImage, imageMetadata")
        .order("id", { ascending: true });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  return (
    <>
      <Helmet>
        <title>Categories - Dive Tech</title>
        <meta name="description" content="Browse all technology categories on Dive Tech." />
      </Helmet>
      <div className="pt-16 pb-12 bg-white dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-8 text-center">
            Categories
          </h1>

          {isLoading ? (
            <div className="py-12 text-center" aria-busy="true">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent dark:border-accent dark:border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading categories...</p>
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-red-600 dark:text-red-400">
              <i className="fas fa-exclamation-triangle text-5xl mb-4"></i>
              <h3 className="font-heading text-2xl font-bold mb-2">Failed to Load</h3>
              <p>There was a problem fetching categories. Please try again later.</p>
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <i className="fas fa-folder-open text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
              <h3 className="font-heading text-2xl font-bold mb-2">No Categories Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                No categories are available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
