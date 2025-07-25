import { storage } from "./storage";
import { createClient } from "@supabase/supabase-js";
import { type InsertUser, type InsertCategory, type InsertArticle, type InsertSubscriber, type InsertSiteStat } from "@shared/schema";

const supabaseAdminUrl = process.env.SUPABASE_URL || "";
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseAdminUrl || !supabaseAdminKey) {
  throw new Error("Missing Supabase admin credentials! Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.");
}

const supabaseAdmin = createClient(supabaseAdminUrl, supabaseAdminKey);

async function main() {
  console.log(`Start seeding database...`);
  
  // Check if admin user exists in auth.users
const { data: existingAdmin, error } = await supabaseAdmin.auth.admin.listUsers({
  email: 'admin@divetech.com',
});

if (error) {
  console.error("Error checking admin user:", error);
  process.exit(1);
}

const adminUser = existingAdmin?.users?.[0];

if (!adminUser) {
  // Create admin user in auth.users
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@divetech.com',
    password: 'adminivy123#',
    email_confirm: true,
    user_metadata: {
      username: 'admin',
      role: 'admin'
    }
  });
  
  if (createError) {
    console.error("Error creating admin user:", createError);
    process.exit(1);
  }
  
  console.log(`Created admin user with id: ${newUser.user.id}`);
} else {
  console.log('Admin user already exists');
}

  // Add categories if they don't exist
  const categories = [
    { name: 'Development', slug: 'development', description: 'Programming and software development' },
    { name: 'Design', slug: 'design', description: 'UI/UX and graphic design' },
    { name: 'Business', slug: 'business', description: 'Business and entrepreneurship' }
  ];

  for (const cat of categories) {
    const existingCategory = await storage.getCategoryBySlug(cat.slug);
    if (!existingCategory) {
      const categoryData: InsertCategory = {
        name: cat.name,
        slug: cat.slug,
        description: cat.description
      };
      const newCategory = await storage.createCategory(categoryData);
      console.log(`Created category: ${newCategory.name}`);
    }
  }
  
  // Get all categories for reference when creating articles
  const allCategories = await storage.getCategories();
  
  // Add sample articles if none exist
  const articles = await storage.getArticles();
  if (articles.length === 0) {
    const sampleArticles = [
      {
        title: 'Getting Started with Web Development',
        slug: 'getting-started-with-web-development',
        summary: 'A beginner\'s guide to web development',
        content: '# Getting Started with Web Development\n\nThis is a comprehensive guide for beginners...',
        image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80',
        categoryId: allCategories.find(c => c.slug === 'development')?.id || 1,
        featured: true,
        authorId: existingAdmin?.id || ''
      },
      {
        title: 'Best Practices for UI Design',
        slug: 'best-practices-for-ui-design',
        summary: 'Create user interfaces that users will love',
        content: '# Best Practices for UI Design\n\nIn this article we explore modern UI design principles...',
        image: 'https://images.unsplash.com/photo-1593642702909-dec73df255d7?auto=format&fit=crop&w=800&q=80',
        categoryId: allCategories.find(c => c.slug === 'design')?.id || 1,
        featured: true,
        authorId: existingAdmin?.id || ''
      },
      {
        title: 'The Future of Artificial Intelligence',
        slug: 'future-of-ai',
        summary: 'How AI is shaping our world and what to expect next',
        content: '# The Future of Artificial Intelligence\n\nAI technologies are advancing rapidly...',
        image: 'https://images.unsplash.com/photo-1551845728-6820a54c4226?auto=format&fit=crop&w=800&q=80',
        categoryId: allCategories.find(c => c.slug === 'development')?.id || 1,
        featured: false,
        authorId: existingAdmin?.id || ''
      }
    ];
    
    for (const article of sampleArticles) {
      const articleData: InsertArticle = {
        ...article,
        tags: ['sample', article.categoryId === 1 ? 'tech' : 'design']
      };
      
      const newArticle = await storage.createArticle(articleData);
      console.log(`Created article: ${newArticle.title}`);
    }
  } else {
    console.log(`${articles.length} articles already exist, skipping article creation`);
  }
  
  // Add some stats data if none exists
  const stats = await storage.getSiteStats();
  if (stats.length === 0) {
    const statData: InsertSiteStat = {
      pageViews: 1250,
      uniqueVisitors: 450,
      bounceRate: 35,
      avgSessionDuration: 120,
      date: new Date()
    };
    
    await storage.updateSiteStats(statData);
    console.log('Created site statistics');
  }
  
  // Add subscribers if none exist
  const subscribers = await storage.getSubscribers();
  if (subscribers.length === 0) {
    const subscriberEmails = [
      'subscriber1@example.com',
      'subscriber2@example.com',
      'subscriber3@example.com'
    ];
    
    for (const email of subscriberEmails) {
      const subscriberData: InsertSubscriber = {
        email,
        active: true
      };
      
      await storage.createSubscriber(subscriberData);
    }
    console.log('Created sample subscribers');
  }
  
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
