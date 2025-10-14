const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.PROD_ORIGIN || 'https://coinsage-transaction-categorisation.onrender.com']
        : ['http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());

const loadRoutes = (routePath, mountPath, routeName) => {
    try {
        const routes = require(routePath);
        app.use(mountPath, routes);
        console.log(`${routeName} routes loaded`);
    } catch(error) {
        console.error(`Error loading ${routeName} routes: `, error.message);
        process.exit(1);
    }
};

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

loadRoutes('./routes/auth', '/api/auth', 'Auth');
loadRoutes('./routes/categories', '/api/categories', 'Category');
loadRoutes('./routes/transactions', '/api/transactions', 'Transactions');
loadRoutes('./routes/budgets', '/api/budgets', 'Budgets');
loadRoutes('./routes/ai', '/api.ai', 'AI');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API route ${req.originalUrl} not found`
    });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = async() => {
    try {
        const requiredEnv = ['JWT_SECRET', 'MONGODB_URI', 'PORT'];
        const missingEnv = requiredEnv.filter((env) => !process.env[env]);
        if(missingEnv.length > 0) {
            console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
            process.exit(1);
        }

        await connectDB();
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });

        const shutdown = () => {
            console.log('Shutting down server...');
            server.close(() => {
                console.log('Server closed');
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed')
                    process.exit(0);
                });
            });
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    } catch(error) {
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
};

startServer();