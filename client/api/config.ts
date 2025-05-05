/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// API configuration for frontend
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function for API requests with credentials
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    // Handle errors based on status code
    if (response.status === 401) {
      // Handle unauthorized
      console.error('Authentication required');
      // You could redirect to login or dispatch an auth error action
    }
    
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'An unknown error occurred' };
    }
    
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  // For HEAD or DELETE requests that don't return content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

// Standard API methods
export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint),
  
  post: (endpoint: string, data: any) => fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint: string, data: any) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint: string) => fetchWithAuth(endpoint, {
    method: 'DELETE',
  }),
  
  upload: async (endpoint: string, file: File, fieldName: string = 'image') => {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    return fetchWithAuth(endpoint, {
      method: 'POST',
      body: formData,
      headers: {} // Let the browser set the correct Content-Type with boundary
    });
  }
};