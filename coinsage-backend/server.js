const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://production-url'] }));
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

try {
    const transactionRoutes = require('./routes/transactions');
    app.use('/api/transactions', transactionRoutes);
    console.log('Transactions routes loaded');
} catch(error) {
    console.error('Error loading transactions routes: ', error.message);
}

try {
    const budgetsRoutes = require('./routes/budgets');
    app.use('/api/budgets', budgetsRoutes);
    console.log('Budget routes loaded');
} catch(error) {
    console.error('Error loading budgets routes: ', error.message);
}

try {
    const aiRoutes = require('./routes/ai');
    app.use('/api/ai', aiRoutes);
    console.log('AI routes loaded');
} catch(error) {
    console.error('Error loading AI routes: ', error.message);
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
        if(!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
            console.error('Missing required environment variables (JWT_SECRET or MONGODB_URI)');
            process.exit(1);
        }

        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down...');
            server.close(() => {
                console.log('Server closed');
                mongoose.connection.close(() => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                });
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGTERM received, shutting down...');
            server.close(() => {
                console.log('Server closed');
                mongoose.connection.close(() => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                });
            });
        });
    } catch(error) {
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
};

startServer();