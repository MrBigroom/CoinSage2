const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// const connectDB = require('./config/database');

// const authRoutes = require('./routes/auth');
// const transactionsRoutes = require('./routes/transactions');
// const budgetsRoutes = require('./routes/budgets');
// const categoriesRoutes = require('./routes/categories');
// const aiRoutes = require('./routes/ai');

app.use(cors());
app.use(express.json());

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch(error) {
        console.error('Database connection error: ', error.message);
        process.exit(1);
    }
};

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running successfully',
        timestamp: new Date().toISOString()
    });
});

try {
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('Auth routes loaded');
} catch(error) {
    console.error('Error loading auth routes: ', error.message);
}

try {
    const categoryRoutes = require('./routes/categories');
    app.use('/api/categories', categoryRoutes);
    console.log('Category routes loaded');
} catch(error) {
    console.error('Error loading category routes: ', error.message);
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

app.use('/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async() => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });
    } catch(error) {
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
};



startServer();