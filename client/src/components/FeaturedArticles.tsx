import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";

const FeaturedArticles = () => {
  const [position, setPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  
  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });

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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [featuredArticles]);

  // Default placeholder articles for when data is loading
  const placeholderArticles: Partial<Article>[] = [
    {
      id: 1,
      title: "The Quantum Revolution: Computing's Next Frontier",
      summary: "Exploring how quantum computers are solving problems that were previously impossible with traditional computing methods.",
      slug: "quantum-revolution",
      categoryId: 4, // Emerging Technologies
      createdAt: new Date("2023-09-28"),
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Machine Learning Frameworks: 2023 Comparison",
      summary: "Comparing TensorFlow, PyTorch, and JAX for different AI workloads with performance benchmarks.",
      slug: "ml-frameworks-comparison",
      categoryId: 2, // Software Development
      createdAt: new Date("2023-09-25"),
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Breakthroughs in Solar Cell Efficiency",
      summary: "New perovskite-silicon tandem cells are breaking efficiency records, promising cheaper renewable energy.",
      slug: "solar-cell-efficiency",
      categoryId: 5, // Green Tech
      createdAt: new Date("2023-09-21"),
      image: "https://images.unsplash.com/photo-1548611716-b7e73254bada?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "The Future of Immersive Entertainment",
      summary: "How AR and VR technologies are transforming gaming, film, and live events experiences.",
      slug: "immersive-entertainment",
      categoryId: 6, // Media & Entertainment
      createdAt: new Date("2023-09-18"),
      image: "https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const articles = featuredArticles || placeholderArticles;
  const maxPosition = Math.ceil(articles.length / itemsPerSlide) - 1;

  const prev = () => {
    setPosition(p => Math.max(0, p - 1));
  };

  const next = () => {
    setPosition(p => Math.min(maxPosition, p + 1));
  };

  const goToSlide = (index: number) => {
    setPosition(index);
  };

  return (
    <section id="featured" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">
          Featured <span className="text-primary dark:text-accent">Articles</span>
        </h2>
        
        <div className="relative">
          {/* Slider controls */}
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
            onClick={prev}
            aria-label="Previous articles"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {/* Featured articles slider */}
          <div className="overflow-hidden px-12" ref={sliderRef}>
            <motion.div 
              className="flex"
              animate={{ x: -position * (100 / itemsPerSlide) + '%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {articles.map((article, index) => (
                <div 
                  key={article.id || index} 
                  className={`w-full md:w-1/2 lg:w-1/3 p-4 flex-shrink-0`}
                >
                  <ArticleCard article={article as Article} />
                </div>
              ))}
            </motion.div>
          </div>
          
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
            onClick={next}
            aria-label="Next articles"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        {/* Slider dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxPosition + 1 }).map((_, index) => (
            <button 
              key={index}
              className={`h-2.5 w-2.5 rounded-full ${
                position === index 
                  ? 'bg-primary dark:bg-accent' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary dark:hover:bg-accent'
              }`}
              aria-current={position === index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
