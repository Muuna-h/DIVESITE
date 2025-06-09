import { supabase } from '../server/db';
import {
  users, categories, articles,
  type InsertUser, type InsertCategory, type InsertArticle
} from '../shared/schema';
import { eq } from 'drizzle-orm';

const db = supabase;

async function initDb() {
  console.log('Initializing database...');

  try {
    // Create admin user
    const adminUser = {
      username: 'emmanuel',
      password: 'Bnmjkl0987', // In production, hash this password
      name: 'Emmanuel',
      email: 'emmanuel@divetech.com',
      role: 'admin'
    };

    // Check if admin user exists
    const existingUser = await db.select().from(users).where(eq(users.username, 'admin'));
    
    if (existingUser.length === 0) {
      console.log('Creating admin user...');
      await db.insert(users).values(adminUser);
    } else {
      console.log('Admin user already exists');
    }

    // Create categories
    const defaultCategories = [
      {
        name: 'Information Technology',
        slug: 'it',
        description: 'Networking, Cloud Computing, Cybersecurity, Data Storage',
        icon: 'fa-server',
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-700'
      },
      {
        name: 'Software Development',
        slug: 'software',
        description: 'Programming Languages, Web/App Dev, AI/ML, Mobile Dev',
        icon: 'fa-code',
        gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600'
      },
      {
        name: 'Hardware Technology',
        slug: 'hardware',
        description: 'Computers, Semiconductors, IoT Devices, Robotics',
        icon: 'fa-microchip',
        gradient: 'bg-gradient-to-r from-gray-600 to-gray-800'
      },
      {
        name: 'Emerging Technologies',
        slug: 'emerging',
        description: 'Quantum Computing, Blockchain, AR/VR, Biotech',
        icon: 'fa-atom',
        gradient: 'bg-gradient-to-r from-cyan-500 to-teal-500'
      },
      {
        name: 'Green Tech',
        slug: 'green',
        description: 'Renewable Energy, Sustainable Manufacturing, EVs',
        icon: 'fa-leaf',
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-600'
      },
      {
        name: 'Media & Entertainment',
        slug: 'media',
        description: 'Gaming, Film/Audio Tech, Streaming Services',
        icon: 'fa-gamepad',
        gradient: 'bg-gradient-to-r from-red-500 to-pink-600'
      },
      {
        name: 'Communication Technology',
        slug: 'communication',
        description: 'Telecom, Mobile Tech, Video Conferencing',
        icon: 'fa-satellite-dish',
        gradient: 'bg-gradient-to-r from-amber-500 to-orange-600'
      },
      {
        name: 'Tech Jobs & Internships',
        slug: 'jobs',
        description: 'Career advice, job listings, and interview preparation',
        icon: 'fa-briefcase',
        gradient: 'bg-gradient-to-r from-blue-400 to-violet-500'
      },
      {
        name: 'Tech Product Reviews',
        slug: 'reviews',
        description: 'Hands-on reviews, comparisons, and buying guides',
        icon: 'fa-star',
        gradient: 'bg-gradient-to-r from-slate-500 to-slate-700'
      }
    ];

    // Check existing categories
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length === 0) {
      console.log('Creating categories...');
      for (const category of defaultCategories) {
        await db.insert(categories).values(category);
      }
    } else {
      console.log(`${existingCategories.length} categories already exist`);
    }

    // Create sample article if no articles exist
    const existingArticles = await db.select().from(articles);
    
    if (existingArticles.length === 0) {
      console.log('Creating sample article...');
      
      // First get admin user and first category
      const [adminUserData] = await db.select().from(users).where(eq(users.username, 'admin'));
      const [firstCategory] = await db.select().from(categories).limit(1);
      
      if (adminUserData && firstCategory) {
        const sampleArticle = {
          title: 'Getting Started with Tech Blogging',
          slug: 'getting-started-with-tech-blogging',
          summary: 'Learn how to start your tech blog and share your knowledge with the world.',
          content: `
# Getting Started with Tech Blogging

Welcome to Dive Tech! This is a sample article to help you get started with tech blogging.

## Why Start a Tech Blog?

Tech blogging allows you to share your knowledge, build your personal brand, and connect with others in the industry.

## How to Choose Your Topics

Focus on your strengths and interests. What technology are you most familiar with? What subjects excite you?

## Best Practices

- Write consistently
- Use clear, concise language
- Include code examples when relevant
- Add visuals to break up text
- Engage with your readers in the comments

Good luck on your tech blogging journey!
          `,
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          topImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          categoryId: firstCategory.id,
          authorId: adminUserData.id,
          tags: ['blogging', 'tech', 'writing', 'tips'],
          featured: true
        };
        
        await db.insert(articles).values(sampleArticle);
      } else {
        console.log('Could not create sample article: admin user or category not found');
      }
    } else {
      console.log(`${existingArticles.length} articles already exist`);
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

initDb();