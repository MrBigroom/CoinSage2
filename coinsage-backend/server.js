const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');
const budgetsRoutes = require('./routes/budgets');
const categoriesRoutes = require('./routes/categories');
const aiRoutes = require('./routes/ai');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/app/auth', authRoutes);
app.use('/app/transactions', transactionsRoutes);
app.use('/app/budgets', budgetsRoutes);
app.use('/app/categories', categoriesRoutes);
app.use('/app/ai', aiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running successfully' });
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));