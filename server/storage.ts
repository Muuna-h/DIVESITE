import {
  users,
  categories,
  articles,
  subscribers,
  contactMessages,
  siteStats,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Article,
  type InsertArticle,
  type Subscriber,
  type InsertSubscriber,
  type ContactMessage,
  type InsertContactMessage,
  type SiteStat,
  type InsertSiteStat,
} from "@shared/schema";
import { supabase } from "./db";
import {
  eq,
  like,
  desc,
  asc,
  and,
  or,
  sql,
  gte,
  lte,
  sum,
  lt,
} from "drizzle-orm";

interface FileUploadResult {
  path: string;
  url: string;
}

interface FileDeleteResult {
  success: boolean;
  error?: string;
}

interface SiteStatsAggregate {
  totalPageViews: number;
  totalUniqueVisitors: number;
  avgBounceRate: number;
  avgSessionDuration: number;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(options?: {
    includeDetails?: boolean;
  }): Promise<Partial<Category>[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(
    id: number,
    category: Partial<InsertCategory>,
  ): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Article methods
  getArticles(): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getFeaturedArticles(): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getArticlesByCategory(categoryId: number): Promise<Article[]>;
  getArticlesByCategorySlug(slug: string): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(
    id: number,
    article: Partial<InsertArticle>,
  ): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  incrementArticleViews(id: number): Promise<void>;

  // Subscriber methods
  getSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;

  // Contact message methods
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<boolean>;

  // Site stats methods
  getSiteStats(): Promise<SiteStat[]>;
  getSiteStatsComparison(
    periodDays: number,
  ): Promise<{
    current: SiteStatsAggregate | null;
    previous: SiteStatsAggregate | null;
  }>;
  updateSiteStats(stats: Partial<InsertSiteStat>): Promise<SiteStat>;

  // Update user role
  updateUserRole(id: number, role: string): Promise<boolean>;

  // File storage methods
  uploadFile(
    bucket: string,
    path: string,
    file: File,
  ): Promise<FileUploadResult>;
  deleteFile(bucket: string, path: string): Promise<FileDeleteResult>;
  getFileUrl(bucket: string, path: string): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) return undefined;
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (error) return undefined;
    return data;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert(insertUser)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserRole(id: number, role: string): Promise<boolean> {
    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id);

    return !error;
  }

  // Category methods
  async getCategories(options?: {
    includeDetails?: boolean;
  }): Promise<Partial<Category>[]> {
    try {
      const select = options?.includeDetails ? "*" : "id,name,slug";

      const { data, error } = await supabase.from("categories").select(select);

      if (error) throw error;

      interface BaseCategoryResult {
        id: number;
        name: string;
        slug: string;
      }

      interface DetailedCategoryResult extends BaseCategoryResult {
        description: string | null;
        icon: string | null;
        gradient: string | null;
        image: string | null;
      }

      return (
        data as unknown as (BaseCategoryResult &
          Partial<DetailedCategoryResult>)[]
      ).map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        ...(options?.includeDetails && {
          description: cat.description,
          icon: cat.icon,
          gradient: cat.gradient,
          image: cat.image,
        }),
      }));
    } catch (error) {
      console.error("Error in getCategories:", error);
      return [];
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const { data, error } = await supabase
      .from("categories")
      .select()
      .eq("slug", slug)
      .single();

    if (error) return undefined;
    return data;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const { data, error } = await supabase
      .from("categories")
      .select()
      .eq("id", id)
      .single();

    if (error) return undefined;
    return data;
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.getCategoryById(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCategory(
    id: number,
    updateData: Partial<InsertCategory>,
  ): Promise<Category | undefined> {
    try {
      const { data: updatedCategory, error } = await supabase
        .from("categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedCategory;
    } catch (error) {
      console.error("Error updating category:", error);
      return undefined;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const { count, error: countError } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("categoryId", id);

      if (countError) throw countError;

      if (count && count > 0) {
        console.error(
          `Cannot delete category ID ${id}: It is currently associated with ${count} articles.`,
        );
        return false;
      }

      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    const { data, error } = await supabase.from("articles").select(`
        *,
        category:categories(*),
        author:users(*)
      `);

    if (error) return [];
    return data;
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*),
        author:users(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) return undefined;
    return data;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*),
        author:users(*)
      `,
      )
      .eq("slug", slug)
      .single();

    if (error) return undefined;
    return data;
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*),
        author:users(*)
      `,
      )
      .eq("featured", true)
      .order("published_at", { ascending: false });

    if (error) return [];
    return data;
  }

  async getLatestArticles(limit: number = 6): Promise<Article[]> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*),
        author:users(*)
      `,
      )
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return data;
  }

  async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*),
        author:users(*)
      `,
      )
      .eq("categoryId", categoryId)
      .order("published_at", { ascending: false });

    if (error) return [];
    return data;
  }

  async getArticlesByCategorySlug(slug: string): Promise<Article[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];

    return this.getArticlesByCategory(category.id);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*),
        author:users(*)
      `,
      )
      .textSearch("title", query)
      .textSearch("content", query, { config: "or" });

    if (error) {
      console.error("Error searching articles:", error);
      return [];
    }

    return data;
  }

  async createArticle(
    insertArticle: InsertArticle & { imageFile?: File; topImageFile?: File },
  ): Promise<Article> {
    const now = new Date().toISOString();
    let image = insertArticle.image;
    let topImage = insertArticle.topImage;

    try {
      if (insertArticle.imageFile) {
        const result = await this.uploadFile(
          "article-images",
          `${Date.now()}-${insertArticle.imageFile.name}`,
          insertArticle.imageFile,
        );
        image = result.url;
      }

      if (insertArticle.topImageFile) {
        const result = await this.uploadFile(
          "article-images",
          `${Date.now()}-top-${insertArticle.topImageFile.name}`,
          insertArticle.topImageFile,
        );
        topImage = result.url;
      }

      const articleToInsert = {
        ...insertArticle,
        image,
        topImage,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
        views: 0,
      };

      delete (articleToInsert as any).imageFile;
      delete (articleToInsert as any).topImageFile;

      const { data: article, error } = await supabase
        .from("articles")
        .insert(articleToInsert)
        .select(
          `
          *,
          category:categories(*),
          author:users(*)
        `,
        )
        .single();

      if (error) throw error;
      return article;
    } catch (error) {
      console.error("Error creating article:", error);
      throw error;
    }
  }

  async updateArticle(
    id: number,
    updateData: Partial<InsertArticle>,
  ): Promise<Article | undefined> {
    const articleExists = await this.getArticleById(id);
    if (!articleExists) return undefined;

    const { data: article, error } = await supabase
      .from("articles")
      .update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        *,
        category:categories(*),
        author:users(*)
      `,
      )
      .single();

    if (error) {
      console.error("Error updating article:", error);
      return undefined;
    }

    return article;
  }

  async deleteArticle(id: number): Promise<boolean> {
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      return !error;
    } catch (error) {
      console.error("Error deleting article:", error);
      return false;
    }
  }

  async incrementArticleViews(id: number): Promise<void> {
    await supabase.rpc("increment_article_views", { article_id: id });
  }

  // Subscriber methods
  async getSubscribers(): Promise<Subscriber[]> {
    const { data, error } = await supabase.from("subscribers").select();

    if (error) return [];
    return data;
  }

  async createSubscriber(
    insertSubscriber: InsertSubscriber,
  ): Promise<Subscriber> {
    const { data: existing } = await supabase
      .from("subscribers")
      .select()
      .eq("email", insertSubscriber.email)
      .single();

    if (existing) {
      if (!existing.active) {
        const { data, error } = await supabase
          .from("subscribers")
          .update({ active: true })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
      return existing;
    }

    const { data, error } = await supabase
      .from("subscribers")
      .insert({
        ...insertSubscriber,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from("contact_messages")
      .select()
      .order("createdAt", { ascending: false });

    if (error) return [];
    return data;
  }

  async createContactMessage(
    insertMessage: InsertContactMessage,
  ): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        ...insertMessage,
        read: false,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read: true })
      .eq("id", id);

    return !error;
  }

  // Site stats methods
  async getSiteStats(): Promise<SiteStat[]> {
    const { data, error } = await supabase
      .from("site_stats")
      .select()
      .order("date", { ascending: false });

    if (error) return [];
    return data;
  }

  async getSiteStatsComparison(
    periodDays: number,
  ): Promise<{
    current: SiteStatsAggregate | null;
    previous: SiteStatsAggregate | null;
  }> {
    const { data, error } = await supabase.rpc("get_site_stats_comparison", {
      period_days: periodDays,
    });

    if (error || !data) {
      return { current: null, previous: null };
    }

    return data;
  }

  async updateSiteStats(
    updateData: Partial<InsertSiteStat>,
  ): Promise<SiteStat> {
    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("site_stats")
      .select()
      .eq("date", today)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("site_stats")
        .update({
          pageViews: (existing.pageViews || 0) + (updateData.pageViews || 0),
          uniqueVisitors:
            (existing.uniqueVisitors || 0) + (updateData.uniqueVisitors || 0),
          bounceRate: updateData.bounceRate ?? existing.bounceRate,
          avgSessionDuration:
            updateData.avgSessionDuration ?? existing.avgSessionDuration,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("site_stats")
        .insert({
          ...updateData,
          date: today,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // File storage methods
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
  ): Promise<FileUploadResult> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
    };
  }

  async deleteFile(bucket: string, path: string): Promise<FileDeleteResult> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getFileUrl(bucket: string, path: string): Promise<string> {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}

export const storage = new DatabaseStorage();