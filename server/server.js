require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is imported

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Create super admin if not exists
const createSuperAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'superadmin@gmail.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('superadmin@123', salt); // Password to hash
      
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        role: 'superadmin'
      });
      console.log('Super Admin created');
    } else {
      console.log('Super Admin already exists.'); // Added this log for clarity
    }
  } catch (error) {
    console.error('Error creating super admin:', error.message);
  }
};

createSuperAdmin();

// Routes
app.use('/api', require('./routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});