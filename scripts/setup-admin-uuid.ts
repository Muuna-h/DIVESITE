import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dxhpqenxlxycghjdgmxh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aHBxZW54bHh5Y2doamRnbXhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njg4NDQ1NSwiZXhwIjoyMDYyNDYwNDU1fQ.254luA72e4e16AJmS3CZxvknw6byztscQ7ADpzMDdjM";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Creating admin user...");

  const adminEmail = "admin@divetech.com";
  const adminPassword = "admin123456"; // Change this in production
  const adminUsername = "admin";

  try {
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      console.log('Admin user already exists:', existingUser);
      process.exit(0);
    }

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/admin/login`,
        data: {
          username: adminUsername,
          role: 'admin'
        }
      }
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user');
    }

    console.log('Created auth user:', authData.user);

    // Wait for the trigger to create the user profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the user profile with admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({ role: 'admin', name: 'Admin User' })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    console.log('Updated user profile:', userData);
    console.log('\nAdmin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nPlease change the password after first login!');

  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

main();
