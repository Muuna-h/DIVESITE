import { Link } from "wouter";
import { motion } from "framer-motion";

interface CategoryProps {
  category: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    icon: string | null;
    gradient: string | null;
    image?: string | null;
  };
}

const CategoryCard = ({ category }: CategoryProps) => {
  const { 
    slug, 
    name, 
    description = "", 
    icon = "fa-folder", 
    gradient = "bg-gray-500", 
    image 
  } = category;

  return (
    <motion.div 
      className="category-tile bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`h-32 sm:h-40 ${gradient} relative overflow-hidden flex-shrink-0`}>
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <i className={`fas ${icon} text-white text-4xl sm:text-5xl opacity-80`}></i>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity duration-300"></div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <h3 className="font-heading text-lg sm:text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm flex-grow">{description}</p>
        <Link href={`/category/${slug}`}>
          <a className="text-primary dark:text-accent font-medium hover:underline flex items-center mt-auto text-xs sm:text-sm">
            Browse Articles <i className="fas fa-arrow-right ml-1 sm:ml-2 text-xs"></i>
          </a>
        </Link>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
