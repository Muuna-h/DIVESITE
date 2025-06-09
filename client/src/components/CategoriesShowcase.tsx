import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { container, fadeUp, scrollTriggerOptions } from "@/utils/animations";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { supabase } from "@/lib/supabase";

// Define a type that matches CategoryCard's expectations
type CategoryCardType = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  gradient: string | null;
  image: string | null;
};

const CategoriesShowcase = () => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<CategoryCardType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, icon, gradient, image")
        .order("id", { ascending: true });

      if (error) throw new Error(error.message);
      
      // Transform the data to ensure it matches CategoryCardType
      return (data || []).map((category): CategoryCardType => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
        image: category.image,
      }));
    },
    staleTime: 1000, // 1 second
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  console.log(categories);

  return (
    <motion.section 
      id="categories" 
      className="py-16 bg-secondary dark:bg-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-heading text-3xl font-bold mb-8 text-center"
          variants={fadeUp}
        >
          Explore <span className="text-primary dark:text-accent">Categories</span>
        </motion.h2>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading categories...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            <p>Error loading categories. Please try again later.</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
          >
            {categories.map((category) => (
              <motion.div 
                key={category.id} 
                variants={fadeUp}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No categories found.</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default CategoriesShowcase;
