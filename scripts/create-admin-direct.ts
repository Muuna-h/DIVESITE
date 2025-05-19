import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dxhpqenxlxycghjdgmxh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aHBxZW54bHh5Y2doamRnbXhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njg4NDQ1NSwiZXhwIjoyMDYyNDYwNDU1fQ.254luA72e4e16AJmS3CZxvknw6byztscQ7ADpzMDdjM";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// First, verify if user already exists
async function userExists(email: string) {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  return !!data;
}

async function main() {
  console.log("Creating admin user...");

  const adminEmail = "admin@divetech.com";
  const adminPassword = "admin123456"; // Change this in production
  const adminUsername = "admin";
  try {    // Try to sign in with the admin credentials first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    let userId;

    if (signInError) {
      // If sign in fails, create new user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          username: adminUsername,
          role: 'admin'
        }
      });

      if (authError) throw authError;
      userId = authData.user.id;
    } else {
      userId = signInData.user.id;
    }

    if (authError) {
      throw authError;
    }

    console.log("Created auth user:", authData);    // Upsert the user record in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert({
        id: userId,
        username: adminUsername,
        email: adminEmail,
        name: "Admin User",
        role: "admin"
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();

      if (userError) {
        throw userError;
      }

      console.log("Created user profile:", userData);
      console.log("\nAdmin user created successfully!");
      console.log("Email:", adminEmail);
      console.log("Password:", adminPassword);
      console.log("\nPlease change the password after first login!");
    }
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
