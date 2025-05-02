import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import ArticleCard from "./ArticleCard";
import { Article } from "@shared/schema";
import { container, fadeUp, scrollTriggerOptions } from "@/utils/animations";

const LatestArticles = () => {
  const { data: latestArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/latest'],
  });

  // Default placeholder articles for when data is loading
  const placeholderArticles: Partial<Article>[] = [
    {
      id: 5,
      title: "The Rise of Edge Computing in Enterprise Networks",
      summary: "How processing data closer to its source is transforming latency-sensitive applications.",
      slug: "edge-computing-enterprise",
      categoryId: 1, // IT
      createdAt: new Date("2023-10-02"),
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Soft Robotics: The Next Generation of Automation",
      summary: "Flexible materials and biomimetic designs are creating robots that can safely interact with humans.",
      slug: "soft-robotics",
      categoryId: 3, // Hardware
      createdAt: new Date("2023-10-01"),
      image: "https://images.unsplash.com/photo-1561883088-039e53143d73?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
      title: "6G Research: What's Beyond 5G Technology?",
      summary: "Researchers are already developing the next generation of wireless communication with terahertz frequencies.",
      slug: "6g-research",
      categoryId: 7, // Communication
      createdAt: new Date("2023-09-30"),
      image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
      title: "Web3 Development: Building the Decentralized Internet",
      summary: "Frameworks and tools for developing applications on blockchain and distributed systems.",
      slug: "web3-development",
      categoryId: 4, // Emerging Tech
      createdAt: new Date("2023-09-28"),
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      title: "Carbon Capture Technologies: Fighting Climate Change",
      summary: "New methods for removing CO2 from the atmosphere are becoming economically viable.",
      slug: "carbon-capture-tech",
      categoryId: 5, // Green Tech
      createdAt: new Date("2023-09-25"),
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 10,
      title: "Remote Tech Interview Strategies That Actually Work",
      summary: "How to stand out in virtual interviews and land your dream tech role.",
      slug: "remote-tech-interviews",
      categoryId: 8, // Tech Jobs
      createdAt: new Date("2023-09-22"),
      image: "https://images.unsplash.com/photo-1580982327559-c1202864eb63?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const articles = latestArticles || placeholderArticles;

  return (
    <motion.section 
      className="py-16 bg-white dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-heading text-3xl font-bold mb-8 text-center"
          variants={fadeUp}
        >
          Latest <span className="text-primary dark:text-accent">Articles</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
        >
          {articles.map((article, index) => (
            <motion.div 
              key={article.id || index} 
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <ArticleCard article={article as Article} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          variants={fadeUp}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/articles">
              <a className="inline-block bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
                View All Articles
              </a>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LatestArticles;
