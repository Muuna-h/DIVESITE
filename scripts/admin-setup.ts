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

async function findExistingUser(email: string) {
  try {
    // First check auth.users table
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const authUser = users.find(u => u.email === email);
    
    if (!authUser) return null;

    // Then check public.users table
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (dbError && dbError.code !== 'PGRST116') { // Not found is ok
      throw dbError;
    }

    return {
      authUser,
      dbUser
    };
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

async function main() {
  console.log("Starting admin user setup...");

  const adminEmail = "admin@divetech.com";
  const adminPassword = "admin123456";
  const adminUsername = "admin";

  try {
    const existingUser = await findExistingUser(adminEmail);
    
    let userId;
    
    if (existingUser?.authUser) {
      console.log("Admin user exists in auth system, updating...");
      userId = existingUser.authUser.id;
      
      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { 
          password: adminPassword,
          user_metadata: {
            username: adminUsername,
            role: 'admin'
          }
        }
      );
      
      if (updateError) throw updateError;
      console.log("Updated auth user password and metadata");
    } else {
      console.log("Creating new admin user in auth system...");
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          username: adminUsername,
          role: 'admin'
        }
      });
      
      if (createError) throw createError;
      userId = newUser.user.id;
      console.log("Created new auth user");
    }

    // Always ensure the users table record exists and has admin role
    console.log("Updating user profile in database...");
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: adminEmail,
        username: adminUsername,
        name: 'Admin User',
        role: 'admin'
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (profileError) throw profileError;

    console.log("\nAdmin user setup completed successfully!");
    console.log("\nUser Profile:", profile);
    console.log("\nLogin Credentials:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("\nIMPORTANT: Please change the password after first login!");
    
  } catch (error: any) {
    console.error("Failed to set up admin user:", error?.message || error);
    if (error?.code === 'PGRST301') {
      console.log("\nTIP: You may need to run the database migrations first.");
    }
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
