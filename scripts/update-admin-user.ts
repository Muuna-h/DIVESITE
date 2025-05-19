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

async function getExistingUser(email: string) {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) throw error;
  
  return users.find(user => user.email === email);
}

async function main() {
  console.log("Ensuring admin user exists...");

  const adminEmail = "admin@divetech.com";
  const adminPassword = "admin123456"; // Change this in production
  const adminUsername = "admin";

  try {
    // First check if user exists in auth system
    const existingUser = await getExistingUser(adminEmail);
    
    let userId;
    if (existingUser) {
      console.log("Admin user already exists in auth system");
      userId = existingUser.id;
      
      // Update their password if needed
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: adminPassword }
      );
      
      if (updateError) throw updateError;
    } else {
      console.log("Creating new admin user...");
      const { data, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          username: adminUsername,
          role: 'admin'
        }
      });
      
      if (createError) throw createError;
      userId = data.user.id;
    }

    // Ensure user exists in users table with admin role
    console.log("Updating user profile...");
    const { data: userData, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: adminEmail,
        username: adminUsername,
        name: 'Admin User',
        role: 'admin'
      })
      .select()
      .single();

    if (profileError) throw profileError;

    console.log("\nAdmin user configured successfully!");
    console.log("User profile:", userData);
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
