import bcrypt from "bcrypt";
import User from "../modules/user/user.model";
import Product from "../modules/product/product.model";
import Category from "../modules/category/category.model";
import { seedUsers, seedCategories, seedProducts } from "./seed.data";

const seedDatabase = async (): Promise<void> => {
  try {
    const existingUsers = await User.countDocuments();
    const existingCategories = await Category.countDocuments();
    const existingProducts = await Product.countDocuments();

    if (existingUsers > 0 || existingCategories > 0 || existingProducts > 0) {
      console.log("Database already has data, skipping seed.");
      return;
    }

    console.log("Seeding database...");

    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log("  Seeded " + insertedUsers.length + " users");

    const insertedCategories = await Category.insertMany(seedCategories);
    console.log("  Seeded " + insertedCategories.length + " categories");

    const insertedProducts = await Product.insertMany(seedProducts);
    console.log("  Seeded " + insertedProducts.length + " products");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedDatabase;
