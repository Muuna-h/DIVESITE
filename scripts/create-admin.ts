import { supabase } from "../server/db";

async function main() {
  console.log("Creating admin user...");

  const adminEmail = "admin@divetech.com";
  const adminPassword = "admin123456"; // Change this in production
  const adminUsername = "admin";

  try {
    // First, create the user in Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          username: adminUsername,
          role: 'admin'
        }
      }
    });

    if (authError) {
      throw authError;
    }

    console.log("Created auth user:", authData);

    if (authData.user) {
      // Then create the user profile in the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          username: adminUsername,
          email: adminEmail,
          role: "admin",
          name: "Admin User"
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
