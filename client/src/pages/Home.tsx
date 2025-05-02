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
    >
      <Helmet>
        <title>Dive Tech - Dive Into Tomorrow's Tech</title>
        <meta name="description" content="Explore the latest in tech innovations across IT, software development, hardware, emerging technologies and more." />
        <meta property="og:title" content="Dive Tech - Dive Into Tomorrow's Tech" />
        <meta property="og:description" content="Explore the latest in tech innovations across IT, software development, hardware, emerging technologies and more." />
        <meta property="og:type" content="website" />
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
