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

async function ensureAdminUser(email: string, password: string, username: string) {
  // Try to sign in first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  let userId;

  if (signInError && signInError.status === 400) {
    // User doesn't exist, create new one
    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        role: 'admin'
      }
    });

    if (createError) throw createError;
    console.log("Created new admin user in auth system");
    userId = authData.user.id;
  } else if (signInError) {
    throw signInError;
  } else {
    console.log("Admin user already exists in auth system");
    userId = signInData.user.id;
  }

  // Ensure user exists in users table with admin role
  const { data: userData, error: upsertError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      email,
      username,
      name: 'Admin User',
      role: 'admin'
    }, {
      onConflict: 'id',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (upsertError) throw upsertError;

  return userData;
}

async function main() {
  console.log("Ensuring admin user exists...");

  const adminEmail = "admin@divetech.com";
  const adminPassword = "admin123456"; // Change this in production
  const adminUsername = "admin";

  try {
    const userData = await ensureAdminUser(adminEmail, adminPassword, adminUsername);
    console.log("\nAdmin user configured successfully!");
    console.log("User details:", userData);
    console.log("\nLogin credentials:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("\nPlease change the password after first login!");
  } catch (error) {
    console.error("Failed to configure admin user:", error);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
