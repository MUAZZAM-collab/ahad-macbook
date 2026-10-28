const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const DataStore = require('./services/dataStore');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const repairRoutes = require('./routes/repairRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Ahad MacBook API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server & Initialize Datastore
const startServer = async () => {
  try {
    // Attempt MongoDB connection
    await connectDB();
    // Initialize Memory fallback & MongoDB seed checks
    await DataStore.init();

    const server = app.listen(PORT, () => {
      console.log('========================================================');
      console.log(`🚀 Ahad MacBook API Server running on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔐 Admin: admin@ahadmacbook.com / admin123456`);
      console.log(`👤 Customer: customer@example.com / password123`);
      console.log(`🏷️ Sample Repair Tracker ID: AMB-9482`);
      console.log('========================================================');
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
