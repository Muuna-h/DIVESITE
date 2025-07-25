// api/sitemap.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY! // <-- Use the correct env variable name
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const baseUrl = "https://divetech.space";
    const now = new Date().toISOString();

    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("slug, updated_at");
    if (articlesError) throw articlesError;

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("slug, updated_at");
    if (categoriesError) throw categoriesError;

    // Add forum topics and categories queries
    const { data: forumTopics, error: forumError } = await supabase
      .from("forum_topics")
      .select("slug, updated_at");
    if (forumError) throw forumError;

    const { data: forumCategories, error: forumCategoriesError } = await supabase
      .from("forum_categories")
      .select("slug, updated_at");
    if (forumCategoriesError) throw forumCategoriesError;

    const staticRoutes = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/about", priority: "0.5", changefreq: "monthly" },
      { loc: "/contact", priority: "0.5", changefreq: "monthly" },
      { loc: "/services", priority: "0.6", changefreq: "monthly" },
      { loc: "/profile", priority: "0.6", changefreq: "monthly" },
      { loc: "/categories", priority: "0.8", changefreq: "weekly" },
      { loc: "/articles", priority: "0.8", changefreq: "daily" },
      { loc: "/forum", priority: "0.8", changefreq: "daily" },
      { loc: "/forum/new-topic", priority: "0.6", changefreq: "weekly" },
      { loc: "/terms-and-conditions", priority: "0.4", changefreq: "yearly" },
      { loc: "/privacy-policy", priority: "0.4", changefreq: "yearly" },
    ];

    const staticUrls = staticRoutes.map(({ loc, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);

    const articleUrls = (articles || []).map(article => `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at || now).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

    const categoryUrls = (categories || []).map(category => `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${new Date(category.updated_at || now).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);

    const forumUrls = (forumTopics || []).map(topic => `  <url>
    <loc>${baseUrl}/forum/topics/${topic.slug}</loc>
    <lastmod>${new Date(topic.updated_at || now).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);

    const forumCategoryUrls = (forumCategories || []).map(category => `  <url>
    <loc>${baseUrl}/forum/categories/${category.slug}</loc>
    <lastmod>${new Date(category.updated_at || now).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('\n')}
${articleUrls.join('\n')}
${categoryUrls.join('\n')}
${forumUrls.join('\n')}
${forumCategoryUrls.join('\n')}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).send(xml);
  } catch (err: any) {
    res.setHeader("Content-Type", "text/plain");
    res.status(500).send("Sitemap generation error: " + err.message);
  }
}