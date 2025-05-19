import fetch from 'node-fetch';

const SUPABASE_URL = "https://dxhpqenxlxycghjdgmxh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aHBxZW54bHh5Y2doamRnbXhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njg4NDQ1NSwiZXhwIjoyMDYyNDYwNDU1fQ.254luA72e4e16AJmS3CZxvknw6byztscQ7ADpzMDdjM";

async function supabaseRequest(endpoint: string, options: any = {}) {
  const url = `${SUPABASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse response:', response.statusText);
    // If response is 204 No Content, return empty object
    if (response.status === 204) {
      return {};
    }
    throw error;
  }
  
  if (!response.ok) {
    console.error('Request failed:', {
      status: response.status,
      statusText: response.statusText,
      data
    });
    throw new Error(JSON.stringify(data));
  }

  return data;
}

interface SupabaseAuthError {
  message: string;
  status?: number;
}

interface SupabaseAuthResponse {
  id?: string;
  email?: string;
  data?: {
    user?: {
      id: string;
      email: string;
    };
    session?: any;
  };
  error?: SupabaseAuthError;
}

async function main() {
  try {
    console.log("Starting admin user setup...");

    const adminEmail = "admin@divetech.com";
    const adminPassword = "admin123456";
    const adminUsername = "admin";

    // First, try to create the user through Supabase Admin API
    console.log("Creating admin user in Supabase Auth...");
    const createResponse = await supabaseRequest('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          username: adminUsername,
          role: 'admin'
        }
      })
    }) as SupabaseAuthResponse;

    console.log('Create response:', JSON.stringify(createResponse, null, 2));

    if (createResponse.error) {
      // If user exists, try to get the user info
      console.log("User might already exist, trying to get user info...");
      const { data: users, error: getUserError } = await supabaseRequest('/auth/v1/admin/users', {
        method: 'GET',
        headers: {
          'Range': '0-1'
        }
      });

      if (getUserError || !users?.length) {
        throw new Error('Could not find or create admin user');
      }

      const existingUser = users.find(u => u.email === adminEmail);
      if (!existingUser) {
        throw new Error('Could not find admin user');
      }

      console.log("Found existing admin user");
      
      // Get RLS bypass headers using service role key
      const authHeaders = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      };

      // Update the user's role in the database
      await supabaseRequest(`/rest/v1/users`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          id: existingUser.id,
          role: 'admin',
          username: adminUsername,
          email: adminEmail,
          password: adminPassword
        })
      });

      console.log("Updated admin user role");
    } else {
      console.log("Created new admin user");
      
      const userId = createResponse.user?.id;
      if (!userId) {
        throw new Error('Could not get user ID from create response');
      }

      // Get RLS bypass headers using service role key
      const authHeaders = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      };

      // Create the user record in the database
      await supabaseRequest(`/rest/v1/users`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          id: userId,
          role: 'admin',
          username: adminUsername,
          email: adminEmail,
          password: adminPassword
        })
      });

      console.log("Created admin user record");
    }

    console.log("Admin user setup complete!");

  } catch (error) {
    console.error("Error setting up admin user:", error);
    process.exit(1);
  }
}

main().catch(console.error);
