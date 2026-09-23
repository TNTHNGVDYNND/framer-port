import mongoose from 'mongoose';
import User from '../src/models/User.js';
import { env } from '../src/config/index.js';
import { connectDB } from '../src/config/database.js';

const seedAdmin = async () => {
  // N1 (PR #49 review): env presence + strength gates run BEFORE connectDB() —
  // weak/placeholder config dies fast with zero DB touch.
  const adminEmail = env.admin.email;
  const adminPassword = env.admin.password;

  if (!adminEmail || !adminPassword) {
    console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  // I-3 (#39): refuse weak/placeholder admin passwords at seed time — same
  // strength contract the (removed) registration validator enforced: >=8,
  // upper, lower, digit. Placeholder example values fail this by design.
  const strongEnough =
    adminPassword.length >= 8 &&
    /[a-z]/.test(adminPassword) &&
    /[A-Z]/.test(adminPassword) &&
    /\d/.test(adminPassword);
  if (!strongEnough) {
    console.error(
      'Error: ADMIN_PASSWORD must be at least 8 characters with upper, lower, and digit — refusing to seed a weak/placeholder admin credential',
    );
    process.exit(1);
  }

  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin password updated successfully!');
    } else {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully!');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
