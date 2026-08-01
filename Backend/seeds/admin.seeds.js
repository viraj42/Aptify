require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set. Create Backend/.env with MONGO_URI before running seeds.");
  process.exit(1);
}

// Admin credentials must be provided via environment variables — never hardcoded
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Set ADMIN_EMAIL and ADMIN_SEED_PASSWORD in Backend/.env before seeding admin.");
  process.exit(1);
}

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    name: "Project Admin",
    email: ADMIN_EMAIL,
    passwordHash: hashed,
    role: "admin",
  });

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();