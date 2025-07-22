import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image: string;
  category_id: number;
  author_id: string;
  created_at: string;
  updated_at: string;
  featured: boolean;
  tags: string[];
}

export function useArticles() {
  return useQuery({
    queryKey: ['/api/articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Article[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['/api/articles/featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Article[];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes for featured articles
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['/api/articles', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      return data as Article;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useLatestArticles(limit: number = 5) {
  return useQuery({
    queryKey: ['/api/articles/latest', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data as Article[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for latest articles
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useCategoryArticles(categoryId: number) {
  return useQuery({
    queryKey: ['/api/articles/category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Article[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
