const express = require('express');
const cors = require('cors');
const { connectDB } = require('./lib/mongodb');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB холболт тест
app.get('/api/test-db', async (req, res) => {
  try {
    await connectDB();
    res.json({ success: true, message: 'MongoDB холбогдсон' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'MongoDB холболтын алдаа', error: error.message });
  }
});

// Server эхлүүлэх
app.listen(PORT, () => {
  console.log(`Server ажиллаж байна: http://localhost:${PORT}`);
}); 