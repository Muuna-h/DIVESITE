import { storage } from "./storage";

async function main() {
  console.log(`Updating user to admin role...`);
  
  try {
    // First, check for user with ID 2 (admin from logs)
    const user = await storage.getUser(2);
    
    if (!user) {
      console.error('User with ID 2 not found');
      return;
    }
    
    console.log('Current user details:', user);
    
    // Update the user role to admin if not already
    if (user.role !== 'admin') {
      await storage.updateUserRole(user.id, 'admin');
      console.log(`Updated user ${user.username} (ID: ${user.id}) to admin role`);
      
      // Verify the update
      const updatedUser = await storage.getUser(user.id);
      console.log('Updated user details:', updatedUser);
    } else {
      console.log(`User ${user.username} (ID: ${user.id}) is already an admin`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
  
  console.log(`Update process finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  }); 