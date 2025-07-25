import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { fadeUp, container, scaleUp, scrollTriggerOptions } from "@/utils/animations";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase"; // ✅ Adjust this import path as needed

const FeaturedArticles = () => {
  const [position, setPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // ✅ Direct Supabase fetch with React Query
  const { data, isLoading, error } = useQuery<Article[]>({
    queryKey: ["featured-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, category:categories(*), author:users(*)")
        .eq("featured", true)
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Supabase error: ${error.message}`);
      }

      return data || [];
    },
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const featuredArticles = Array.isArray(data) ? data : [];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }

      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.scrollWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [featuredArticles]);

  if (isLoading) {
    return (
      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Featured <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-accent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Featured <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p>Unable to load featured articles</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticles || featuredArticles.length === 0) {
    return (
      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Featured <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="text-center p-6">
            <p className="text-gray-600 dark:text-gray-400">No featured articles available.</p>
          </div>
        </div>
      </section>
    );
  }

  const maxPosition = Math.max(0, Math.ceil(featuredArticles.length / itemsPerSlide) - 1);

  const prev = () => setPosition((p) => Math.max(0, p - 1));
  const next = () => setPosition((p) => Math.min(maxPosition, p + 1));
  const goToSlide = (index: number) => setPosition(index);

  return (
    <motion.section
      id="featured"
      className="py-16 bg-white dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
      variants={container}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="font-heading text-3xl font-bold mb-8 text-center"
          variants={fadeUp}
        >
          Featured <span className="text-primary dark:text-accent">Articles</span>
        </motion.h2>

        <motion.div className="relative" variants={scaleUp}>
          <motion.button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            onClick={prev}
            aria-label="Previous articles"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-chevron-left"></i>
          </motion.button>

          <div className="overflow-hidden px-4 sm:px-12" ref={sliderRef}>
            <motion.div
              className="flex"
              animate={{ x: `-${position * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id || index}
                  className="w-full flex-shrink-0 p-2 sm:p-4"
                  style={{ flexBasis: `${100 / itemsPerSlide}%` }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/article/${article.slug}`}>
                    <a>
                      <ArticleCard article={article} />
                    </a>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            onClick={next}
            aria-label="Next articles"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-chevron-right"></i>
          </motion.button>
        </motion.div>

        <motion.div className="flex justify-center mt-8 space-x-2" variants={fadeUp}>
          {Array.from({ length: maxPosition + 1 }).map((_, index) => (
            <motion.button
              key={index}
              className={`h-2.5 w-2.5 rounded-full ${
                position === index
                  ? "bg-primary dark:bg-accent"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-primary dark:hover:bg-accent"
              }`}
              aria-current={position === index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            ></motion.button>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedArticles;
