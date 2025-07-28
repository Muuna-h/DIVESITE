import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import CategoriesShowcase from "@/components/CategoriesShowcase";
import LatestArticles from "@/components/LatestArticles";
import ServicesSection from "@/components/ServicesSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import { motion } from "framer-motion";
import { pageTransition } from "@/utils/animations";

const Home = () => {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-x-hidden" // Prevent horizontal scroll on mobile
    >
      <Helmet>
        <title>Dive Tech - Dive Into Tomorrow's Tech</title>
        <meta name="description" content="Explore the latest in tech innovations across IT, software development, hardware, emerging technologies and more." />
        <meta property="og:title" content="Dive Tech - Dive Into Tomorrow's Tech" />
        <meta property="og:description" content="Explore the latest in tech innovations across IT, software development, hardware, emerging technologies and more." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Helmet>
      
      <HeroSection />
      <FeaturedArticles />
      <ServicesSection />
      <CategoriesShowcase />
      <LatestArticles />
      <NewsletterSignup />
    </motion.div>
  );
};

export default Home;
