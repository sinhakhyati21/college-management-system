import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "./src/models/user.model.js";
dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

    const existing = await User.findOne({ role: "Admin" });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "Admin",
      isPasswordSet: true
    });

    console.log("Admin created successfully");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();