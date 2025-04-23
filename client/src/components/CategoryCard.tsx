import { Link } from "wouter";
import { motion } from "framer-motion";

interface CategoryProps {
  category: {
    id: number;
    slug: string;
    name: string;
    description: string;
    icon: string;
    gradient: string;
  };
}

const CategoryCard = ({ category }: CategoryProps) => {
  const { slug, name, description, icon, gradient } = category;

  return (
    <motion.div 
      className="category-tile bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`h-40 ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className={`fas ${icon} text-white text-5xl`}></i>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <Link href={`/category/${slug}`}>
          <a className="text-primary dark:text-accent font-medium hover:underline flex items-center">
            Browse Articles <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </Link>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
