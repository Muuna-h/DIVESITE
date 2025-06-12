import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with the database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
}

// Create client with custom fetch options to handle CORS issues
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage
  },
  global: {
    headers: {
      'X-Client-Info': 'techblog-client',
    },
    fetch: async (url: string, options: RequestInit = {}) => {
      // Base options with credentials
      const customOptions: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          'Origin': window.location.origin,
        },
      };

      // Special handling for token refresh requests
      if (url.includes('/auth/v1/token')) {
        customOptions.headers = {
          ...customOptions.headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        // For OPTIONS preflight requests
        if (options.method === 'OPTIONS') {
          return new Response(null, {
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': window.location.origin,
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Max-Age': '86400',
            },
          });
        }
      }

      try {
        const response = await fetch(url, customOptions);
        return response;
      } catch (error: unknown) {
        console.error('Fetch error:', error instanceof Error ? error.message : String(error));
        throw error;
      }
    },
  },
});

// Helper function to upload an image
export async function uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
  try {
    // First ensure we have a valid session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('No active session found');
      throw new Error("Authentication required for file uploads");
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Add authorization header with the session token
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error: unknown) {
    console.error('Error uploading image:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

// Helper function to delete an image
export async function deleteImage(bucket: string, path: string): Promise<boolean> {
  try {
    // First ensure we have a valid session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('No active session found');
      throw new Error("Authentication required for file deletion");
    }
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error: unknown) {
    console.error('Error deleting image:', error instanceof Error ? error.message : String(error));
    return false;
  }
}
