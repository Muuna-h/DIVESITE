import { motion } from "framer-motion";
import { Link } from "wouter";
import CategoryCard from "./CategoryCard";

// Define the categories with their metadata
const categories = [
  {
    id: 1,
    slug: "it",
    name: "Information Technology",
    description: "Networking, Cloud Computing, Cybersecurity, Data Storage",
    icon: "fa-server",
    gradient: "bg-gradient-to-r from-blue-500 to-blue-700"
  },
  {
    id: 2,
    slug: "software",
    name: "Software Development",
    description: "Programming Languages, Web/App Dev, AI/ML, Mobile Dev",
    icon: "fa-code",
    gradient: "bg-gradient-to-r from-purple-500 to-indigo-600"
  },
  {
    id: 3,
    slug: "hardware",
    name: "Hardware Technology",
    description: "Computers, Semiconductors, IoT Devices, Robotics",
    icon: "fa-microchip",
    gradient: "bg-gradient-to-r from-gray-600 to-gray-800"
  },
  {
    id: 4,
    slug: "emerging",
    name: "Emerging Technologies",
    description: "Quantum Computing, Blockchain, AR/VR, Biotech",
    icon: "fa-atom",
    gradient: "bg-gradient-to-r from-cyan-500 to-teal-500"
  },
  {
    id: 5,
    slug: "green",
    name: "Green Tech",
    description: "Renewable Energy, Sustainable Manufacturing, EVs",
    icon: "fa-leaf",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600"
  },
  {
    id: 6,
    slug: "media",
    name: "Media & Entertainment",
    description: "Gaming, Film/Audio Tech, Streaming Services",
    icon: "fa-gamepad",
    gradient: "bg-gradient-to-r from-red-500 to-pink-600"
  },
  {
    id: 7,
    slug: "communication",
    name: "Communication Technology",
    description: "Telecom, Mobile Tech, Video Conferencing",
    icon: "fa-satellite-dish",
    gradient: "bg-gradient-to-r from-amber-500 to-orange-600"
  },
  {
    id: 8,
    slug: "jobs",
    name: "Tech Jobs & Internships",
    description: "Career advice, job listings, and interview preparation",
    icon: "fa-briefcase",
    gradient: "bg-gradient-to-r from-blue-400 to-violet-500"
  },
  {
    id: 9,
    slug: "reviews",
    name: "Tech Product Reviews",
    description: "Hands-on reviews, comparisons, and buying guides",
    icon: "fa-star",
    gradient: "bg-gradient-to-r from-slate-500 to-slate-700"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const CategoriesShowcase = () => {
  return (
    <section id="categories" className="py-16 bg-secondary dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">
          Explore <span className="text-primary dark:text-accent">Categories</span>
        </h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;
