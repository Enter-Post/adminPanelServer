const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school-management';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'school-management' // Explicitly specify database name
})
.then(async () => {
  console.log('Connected to MongoDB successfully');
  
  try {
    // Create initial admin user if it doesn't exist
    const Admin = require('./models/Admin');
    const adminExists = await Admin.findOne({ email: 'admin@gmail.com' });
    
    if (!adminExists) {
      const newAdmin = new Admin({
        email: 'admin@gmail.com',
        password: 'admin123'
      });
      await newAdmin.save();
      console.log('Initial admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error with admin user:', err);
  }
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import routes
const schoolRoutes = require('./routes/schools');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/schools', schoolRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    details: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 