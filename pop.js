import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["waiter", "admin"], default: "waiter" }
});

const tableSchema = new mongoose.Schema({
  name: String
});

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

const subCategorySchema = new mongoose.Schema({
  name: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
});

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  active: { type: Boolean, default: true }
});

const User = mongoose.model("User", userSchema);
const Table = mongoose.model("Table", tableSchema);
const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);
const Food = mongoose.model("Food", foodSchema);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/foodpos", {
  
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Table.deleteMany({});
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await Food.deleteMany({});

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const waiterPassword = await bcrypt.hash("waiter123", salt);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin"
    });

    const waiter = await User.create({
      name: "Waiter 1",
      email: "waiter1@example.com",
      password: waiterPassword,
      role: "waiter"
    });

    console.log("Users created ✅");

    // Create Tables
    const table1 = await Table.create({ name: "T1" });
    const table2 = await Table.create({ name: "T2" });
    console.log("Tables created ✅");

    // Create Categories
    const foodCat = await Category.create({ name: "Food" });
    const drinksCat = await Category.create({ name: "Drinks" });

    // Create Subcategories
    const vegSub = await SubCategory.create({ name: "Veg", categoryId: foodCat._id });
    const nonVegSub = await SubCategory.create({ name: "Non-Veg", categoryId: foodCat._id });
    const coldDrinksSub = await SubCategory.create({ name: "Cold Drinks", categoryId: drinksCat._id });
    const hotDrinksSub = await SubCategory.create({ name: "Hot Drinks", categoryId: drinksCat._id });

    console.log("Categories & Subcategories created ✅");

    // Create Food Items
    await Food.create([
      { name: "Paneer Butter Masala", price: 150, categoryId: foodCat._id, subCategoryId: vegSub._id },
      { name: "Veg Biryani", price: 120, categoryId: foodCat._id, subCategoryId: vegSub._id },
      { name: "Chicken Curry", price: 200, categoryId: foodCat._id, subCategoryId: nonVegSub._id },
      { name: "Mutton Biryani", price: 250, categoryId: foodCat._id, subCategoryId: nonVegSub._id },
      { name: "Coke", price: 50, categoryId: drinksCat._id, subCategoryId: coldDrinksSub._id },
      { name: "Pepsi", price: 50, categoryId: drinksCat._id, subCategoryId: coldDrinksSub._id },
      { name: "Tea", price: 20, categoryId: drinksCat._id, subCategoryId: hotDrinksSub._id },
      { name: "Coffee", price: 30, categoryId: drinksCat._id, subCategoryId: hotDrinksSub._id }
    ]);

    console.log("Food items created ✅");

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
