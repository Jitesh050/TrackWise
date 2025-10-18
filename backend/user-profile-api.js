// Backend API Stub for User Profile Management
// This file demonstrates how the frontend would integrate with a real backend API

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Mock database - in production, this would be a real database
const users = new Map();

// Initialize with some mock users
users.set('mock-user-id', {
  id: 'mock-user-id',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1990-01-01',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  profilePicture: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
});

// Authentication middleware (simplified)
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ success: false, error: 'No authentication token provided' });
  }
  
  // In production, verify JWT token here
  req.userId = 'mock-user-id'; // Mock user ID
  next();
};

// Routes

// Get user profile
app.get('/api/users/profile', authenticateUser, (req, res) => {
  try {
    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Update user profile
app.put('/api/users/profile', authenticateUser, (req, res) => {
  try {
    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const { firstName, lastName, email, phone, dateOfBirth, address, city, state, zipCode } = req.body;

    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        error: 'First name and last name are required' 
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid phone number format' 
      });
    }

    // Update user data
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      email: email || user.email,
      phone: phone || user.phone,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
      zipCode: zipCode || user.zipCode,
      updatedAt: new Date().toISOString()
    };

    users.set(req.userId, updatedUser);

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Upload profile picture
app.post('/api/users/profile/picture', authenticateUser, upload.single('profilePicture'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Update user's profile picture URL
    const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
    const updatedUser = {
      ...user,
      profilePicture: profilePictureUrl,
      updatedAt: new Date().toISOString()
    };

    users.set(req.userId, updatedUser);

    res.json({
      success: true,
      url: profilePictureUrl,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to upload profile picture' 
    });
  }
});

// Delete user account
app.delete('/api/users/account', authenticateUser, (req, res) => {
  try {
    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // In production, you might want to soft delete or archive the user
    users.delete(req.userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get all users (admin only)
app.get('/api/users', authenticateUser, (req, res) => {
  try {
    // In production, check if user is admin
    const allUsers = Array.from(users.values());
    
    res.json({
      success: true,
      users: allUsers,
      total: allUsers.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        error: 'File too large. Maximum size is 5MB.' 
      });
    }
  }
  
  res.status(500).json({ 
    success: false, 
    error: error.message || 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`User Profile API server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET    /api/users/profile - Get user profile`);
  console.log(`  PUT    /api/users/profile - Update user profile`);
  console.log(`  POST   /api/users/profile/picture - Upload profile picture`);
  console.log(`  DELETE /api/users/account - Delete user account`);
  console.log(`  GET    /api/users - Get all users (admin)`);
});

module.exports = app;
