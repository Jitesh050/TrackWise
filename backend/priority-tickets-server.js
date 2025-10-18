const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/priority-documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed.'), false);
    }
  }
});

// In-memory storage for priority tickets (in production, use a database)
let priorityTickets = [];

// Routes
app.post('/api/priority-tickets/upload', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/priority-documents/${req.file.filename}`;
    
    res.json({
      success: true,
      fileUrl: fileUrl,
      fileName: req.file.originalname,
      filePath: req.file.path
    });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.post('/api/priority-tickets', (req, res) => {
  try {
    const ticketData = {
      id: Date.now().toString(),
      ...req.body,
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    priorityTickets.push(ticketData);
    
    res.json({
      success: true,
      ticket: ticketData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create priority ticket' });
  }
});

app.get('/api/priority-tickets', (req, res) => {
  try {
    const { status, priorityType } = req.query;
    let filteredTickets = [...priorityTickets];
    
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (priorityType) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priorityType === priorityType);
    }
    
    res.json({
      success: true,
      tickets: filteredTickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch priority tickets' });
  }
});

app.put('/api/priority-tickets/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const ticketIndex = priorityTickets.findIndex(ticket => ticket.id === id);
    
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Priority ticket not found' });
    }
    
    priorityTickets[ticketIndex] = {
      ...priorityTickets[ticketIndex],
      status,
      adminNotes,
      updated_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      ticket: priorityTickets[ticketIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update priority ticket status' });
  }
});

app.get('/api/priority-tickets/stats', (req, res) => {
  try {
    const stats = {
      total: priorityTickets.length,
      pending: priorityTickets.filter(t => t.status === 'Pending').length,
      approved: priorityTickets.filter(t => t.status === 'Approved').length,
      rejected: priorityTickets.filter(t => t.status === 'Rejected').length,
      byType: {
        Student: priorityTickets.filter(t => t.priorityType === 'Student').length,
        'Old-Age': priorityTickets.filter(t => t.priorityType === 'Old-Age').length,
        Medical: priorityTickets.filter(t => t.priorityType === 'Medical').length
      }
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Priority Tickets API server running on port ${PORT}`);
  console.log(`Upload directory: ${path.join(__dirname, 'uploads/priority-documents')}`);
});
