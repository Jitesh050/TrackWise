// Express.js backend API stubs for Smart-Rail chatbot integration
const express = require('express');
const app = express();
app.use(express.json());

// Ticket booking endpoint
app.post('/api/tickets/book', (req, res) => {
  // Simulate booking logic
  const { name, source, destination, date, type, email, phone, seat } = req.body;
  if (!name || !source || !destination || !date || !type || !email || !phone) {
    return res.json({ success: false, error: 'Missing required fields.' });
  }
  res.json({
    success: true,
    pnr: Math.floor(Math.random() * 9000000000 + 1000000000),
    source,
    destination,
    date,
    seat: seat || 'A1-23',
  });
});

// Train status endpoint
app.post('/api/train-status', (req, res) => {
  const { pnr } = req.body;
  if (!pnr) return res.json({ status: null });
  // Simulate status
  res.json({
    status: `Train for PNR ${pnr} is on time. Platform 5. ETA: 12:34 PM.`
  });
});

// General chatbot query endpoint
app.post('/api/chatbot/query', (req, res) => {
  const { question } = req.body;
  // Simulate AI response
  res.json({ answer: `You asked: "${question}". This is a mock response from the backend.` });
});

// Start server (for local dev)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
