import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log("Creating admin user...");

  const adminEmail = "admin@divetech.com";
  const adminPassword = "Bnmjkl098"; // Change this in production
  const adminUsername = "admin";

  try {
    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", adminEmail)
      .single();

    if (existingUser) {
      console.log("Admin user already exists in users table:", existingUser);
      return;
    }

    // First, create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          username: adminUsername,
          role: "admin",
        },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        console.log("User already exists in auth, checking users table...");

        // Try to get the existing auth user and create profile
        const {
          data: { users },
          error: listError,
        } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        const existingAuthUser = users.find(
          (user) => user.email === adminEmail,
        );

        if (existingAuthUser) {
          // Create user profile
          const { data: userData, error: userError } = await supabase
            .from("users")
            .insert({
              id: existingAuthUser.id,
              username: adminUsername,
              email: adminEmail,
              role: "admin",
              name: "Admin User",
            })
            .select()
            .single();

          if (userError) {
            console.error("Error creating user profile:", userError);
            return;
          }

          console.log("Created user profile for existing auth user:", userData);
          return;
        }
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Failed to create auth user");
    }

    console.log("Created auth user:", authData.user.id);

    // Wait a moment for any triggers to process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create or update the user profile in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert({
        id: authData.user.id,
        username: adminUsername,
        email: adminEmail,
        role: "admin",
        name: "Admin User",
      })
      .select()
      .single();

    if (userError) {
      console.error("Error creating user profile:", userError);
      return;
    }

    console.log("Created user profile:", userData);
    console.log("\nAdmin user created successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("\nPlease change the password after first login!");
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }
}

createAdminUser()
  .catch(console.error)
  .finally(() => process.exit());
