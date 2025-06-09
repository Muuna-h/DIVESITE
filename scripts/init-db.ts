import { supabase } from '../server/db';
import {
  users, categories, articles,
  type InsertUser, type InsertCategory, type InsertArticle
} from '../shared/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const db = supabase;

async function initDb() {
  console.log('Initializing database...');

  try {
    // Create admin user in Supabase Auth
    const adminEmail = 'admin@divetech.com';
    const adminPassword = 'Bnmjkl098$';
    const id = 1

    // Check if admin exists in Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    const existingAuthUser = authUsers?.users.find(user => user.email === adminEmail);

    if (!existingAuthUser) {
      console.log('Creating admin user in Supabase Auth...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          username: 'admin',
          role: 'admin'
        }
      });
      if (createError) throw createError;
      console.log('Created admin user in Supabase Auth');
    } else {
      console.log('Admin user already exists in Supabase Auth');
    }

    // Check if admin exists in users table
    const { data: existingUser } = await db
      .from('users')
      .select()
      .eq('email', adminEmail)
      .single();

    if (!existingUser) {
      console.log('Creating admin user in database...');
      const { error } = await db.from('users').insert({
        username: 'admin',
        password: adminPassword,
        name: 'Admin User',
        email: adminEmail,
        role: 'admin'
      });
      if (error) throw error;
      console.log('Created admin user in database');
    } else {
      console.log('Admin user already exists in database');
    }

    // Create categories
    const defaultCategories: InsertCategory[] = [
      {
        name: 'Information Technology',
        slug: 'it',
        description: 'Networking, Cloud Computing, Cybersecurity, Data Storage',
        icon: 'fa-server',
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-700',
        image: 'attached_assets/Information Technology.png'
      },
      {
        name: 'Software Development',
        slug: 'software',
        description: 'Programming Languages, Web/App Dev, AI/ML, Mobile Dev',
        icon: 'fa-code',
        gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
        image: 'attached_assets/Software Development.png'
      },
      {
        name: 'Hardware Technology',
        slug: 'hardware',
        description: 'Computers, Semiconductors, IoT Devices, Robotics',
        icon: 'fa-microchip',
        gradient: 'bg-gradient-to-r from-gray-600 to-gray-800',
        image: 'attached_assets/Hardware Technology.png'
      },
      {
        name: 'Emerging Technologies',
        slug: 'emerging',
        description: 'Quantum Computing, Blockchain, AR/VR, Biotech',
        icon: 'fa-atom',
        gradient: 'bg-gradient-to-r from-cyan-500 to-teal-500',
        image: 'attached_assets/Emerging Technologies.png'
      },
      {
        name: 'Green Tech',
        slug: 'green',
        description: 'Renewable Energy, Sustainable Manufacturing, EVs',
        icon: 'fa-leaf',
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
        image: 'attached_assets/Green Tech.png'
      },
      {
        name: 'Media & Entertainment',
        slug: 'media',
        description: 'Gaming, Film/Audio Tech, Streaming Services',
        icon: 'fa-gamepad',
        gradient: 'bg-gradient-to-r from-red-500 to-pink-600',
        image: 'attached_assets/Media & Entertainment.png'
      },
      {
        name: 'Communication Technology',
        slug: 'communication',
        description: 'Telecom, Mobile Tech, Video Conferencing',
        icon: 'fa-satellite-dish',
        gradient: 'bg-gradient-to-r from-amber-500 to-orange-600',
        image: 'attached_assets/Communication Technology.png'
      },
      {
        name: 'Tech Jobs & Internships',
        slug: 'jobs',
        description: 'Career advice, job listings, and interview preparation',
        icon: 'fa-briefcase',
        gradient: 'bg-gradient-to-r from-blue-400 to-violet-500',
        image: 'attached_assets/Tech Jobs & Internships.png'
      },
      {
        name: 'Tech Product Reviews',
        slug: 'reviews',
        description: 'Hands-on reviews, comparisons, and buying guides',
        icon: 'fa-star',
        gradient: 'bg-gradient-to-r from-slate-500 to-slate-700',
        image: 'attached_assets/Tech Product Reviews.png'
      }
    ];

    // Check existing categories
    const { data: existingCategories, error: categoriesError } = await db
      .from('categories')
      .select();

    if (!existingCategories?.length) {
      console.log('Creating categories...');
      for (const category of defaultCategories) {
        const { error } = await db.from('categories').insert(category);
        if (error) throw error;
      }
    } else {
      console.log(`${existingCategories.length} categories already exist`);
    }

    // Create sample article if no articles exist
    const { data: existingArticles, error: articlesError } = await db
      .from('articles')
      .select();

    if (!existingArticles?.length) {
      console.log('Creating sample article...');

      // Get admin user and first category
      const { data: adminUserData } = await db
        .from('users')
        .select('id')
        .eq('username', 'admin')
        .single();

      const { data: firstCategory } = await db
        .from('categories')
        .select('id')
        .limit(1)
        .single();

      if (adminUserData && firstCategory) {

        const sampleArticle: InsertArticle = {
          title: 'Welcome to Dive Tech - Your Ultimate Tech Knowledge Hub',
          slug: 'welcome-to-dive-tech',
          summary: 'Discover Dive Tech, your comprehensive platform for technology insights, learning resources, and expert guidance across various tech domains.',
          content: `
# Welcome to Dive Tech - Your Ultimate Tech Knowledge Hub

Welcome to Dive Tech, where technology meets innovation and knowledge! We're your comprehensive resource for staying ahead in the rapidly evolving tech landscape.

## Our Mission

At Dive Tech, we're committed to making technology accessible, understandable, and exciting for everyone. Whether you're a seasoned professional or just starting your tech journey, we provide valuable insights and resources across multiple technology domains.

## What We Offer

### 1. Comprehensive Tech Coverage

- **Information Technology**: Expert insights on networking, cloud computing, cybersecurity, and data storage solutions
- **Software Development**: In-depth coverage of programming languages, web/app development, AI/ML, and mobile development
- **Hardware Technology**: Latest updates on computers, semiconductors, IoT devices, and robotics
- **Emerging Technologies**: Cutting-edge developments in quantum computing, blockchain, AR/VR, and biotech

### 2. Professional Development

- **Career Guidance**: Expert advice on tech career paths and professional growth
- **Job Opportunities**: Curated tech job listings and internship opportunities
- **Interview Preparation**: Tips and resources for technical interviews
- **Skill Development**: Recommended learning paths and resources

### 3. Product Reviews & Analysis

- **Detailed Reviews**: Comprehensive analysis of the latest tech products
- **Comparison Guides**: Help you make informed decisions about tech purchases
- **Industry Trends**: Stay updated with the latest market developments
- **Best Practices**: Implementation guides and recommendations

### 4. Green Technology Focus

We're committed to sustainable technology, covering:
- Renewable energy solutions
- Sustainable manufacturing practices
- Electric vehicles and clean tech
- Environmental impact assessment

### 5. Media & Entertainment Tech

Stay updated with:
- Gaming technology trends
- Streaming service developments
- Digital content creation tools
- Entertainment tech innovations

## Why Choose Dive Tech?

1. **Expert Content**: Articles written by industry professionals
2. **Current Information**: Regular updates on the latest tech developments
3. **Practical Insights**: Real-world applications and case studies
4. **Community Focus**: Engage with like-minded tech enthusiasts
5. **Comprehensive Coverage**: All aspects of technology under one roof

## Get Involved

- Subscribe to our newsletter for regular updates
- Join our community discussions
- Share your knowledge through guest posts
- Participate in our tech events and webinars

## Connect With Us

Stay connected with Dive Tech:
- Follow us on social media
- Subscribe to our YouTube channel
- Join our Discord community
- Sign up for our email newsletter

Welcome to the future of tech knowledge sharing!
          `,
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          topImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          category_Id: firstCategory.id,
          author_Id: adminUserData.id,
          tags: ['dive tech', 'technology', 'services', 'tech hub', 'learning'],
          featured: true
        };

        const { error } = await db.from('articles').insert(sampleArticle);
        if (error) throw error;
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
