const express = require('express');
const router = express.Router();
const Transactions = require('../models/Transactions');
const AIModelLog = require('../models/AIModelLog');
const Category = require('../models/Category');
const { protect } = require('../middlewares/auth');
const axios = require('axios');

router.get('/', protect, async(req, res) => {
    try {
        const transactions = await Transactions.find({ user_id: req.user._id })
                                                .populate('category_id', 'name')
                                                .sort({ date: -1 });
        res.json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/', protect, async(req, res) => {
    try {
        const { category_id, title, transaction_amount, date, description } = req.body;

        const aiResponse = await axios.post('https://coinsage-ai-service.onrender.com/categorise', {
            title,
            amount: transaction_amount
        });
        const { category, confidence } = aiResponse.data;
        const categoryDoc = await Category.findOne({ name: category });
        if(!categoryDoc) {
            categoryDoc = await Category.create({ name: category, type: transaction_amount > 0 ? 'Income' : 'Expense' })
        }
        category_id = categoryDoc._id;

        await AIModelLog.create({
            transaction_id: null,
            category_id,
            predicted_category: category,
            confidence_score: confidence
        });

        const transaction = await Transactions.create({
            user_id: req.user._id,
            category_id,
            title,
            transaction_amount,
            date: date || Date.now(),
            description
        });

        if(!req.body.category_id) {
            await AIModelLog.updateOne(
                { transaction_id: null, predicted_category: transaction.category_id.name },
                { transaction_id: transaction._id }
            );
        }

        if(transaction_amount < 0) {
            await Budgets.updateMany(
                {
                    user_id: req.user._id,
                    category_id,
                    start_date: { $lte: transaction.date },
                    end_date: { $gte: transaction.date }
                },
                { $inc: { spent_amount: Math.abs(transaction_amount) } }
            );
        }
        res.status(201).json({ success: true, data: transaction });
    } catch(error) {
        res.status(400).json({ success: false, message: error.messge });
    }
});

router.put('/:id', protect, async(req, res) => {
    try {
        const { category_id, title, transaction_amount, date, description } = req.body;
        const transaction = await Transactions.findByIdAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            { category_id, title, transaction_amount, date, description },
            { new: true }
        ).populate('category_id', 'name');
        if(!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        const log = await AIModelLog.findOne({ transaction_id: transaction._id });
        if(log && log.category_id.toString() !== category_id.toString()) {
            await AIModelLog.findByIdAndUpdate(
                { transaction_id: transaction._id },
                {
                    actual_category: (await Category.findById(category_id)).name,
                    status: 'Incorrect',
                }
            );
        }

        res.json({
            success: true,
            data: transaction
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/:id', protect, async(req, res) => {
    try {
        const transaction = await Transactions.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        if(!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        if(transaction.transaction_amount < 0) {
            await Budgets.updateMany(
                {
                    user_id: req.user._id,
                    category_id: transaction.category_id,
                    start_date: { $lte: transaction.date },
                    end_date: { $gte: transaction.date }
                },
                { $inc: { spent_amount: -Math.abs(transaction.transaction_amount) } }
            );
        }
        res.json({
            success: true,
            message: 'Transaction deleted'
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/balance', protect, async(req, res) => {
    try {
        const transactions = await Transactions.find({ user_id: req.user._id });
        const balance = transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
        res.json({
            success: true,
            data: { balance }
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

router.get('/logs', protect, async(req, res) => {
    try {
        const logs = await AIModelLog.find({ transaction_id: { $ne: null } })
                                .populate('transaction_id', 'title transaction_amount date description')
                                .populate('category_id', 'name');
        res.json({
            success: true,
            data: logs
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

router.get('/performance', protect, async(req, res) => {
    try {
        const logs = await AIModelLog.find({ transaction_id: { $ne: null } })
                                .populate('transaction_id', 'category_id')
                                .populate('category_id', 'name');
        const performance = {};
        logs.forEach((log) => {
            const categoryName = log.category_id.name;
            if(!performance[categoryName]) {
                performance[categoryName] = { total: 0, correct: 0, sumConfidence: 0 };
            }
            performance[categoryName].total += 1;
            performance[categoryName].sumConfidence += log.confidence_score;
            if(log.status === 'Correct' || (log.actual_category && log.actual_category === log.predicted_category)) {
                performance[categoryName].correct += 1;
            }
        });

        const result = Object.entries(performance).map(([name, stats]) => ({
            category_name: name,
            total_transactions: stats.total,
            accuracy: (stats.correct / stats.total) * 100 || 0,
            average_confidence: (stats.sumConfidence / sum.total) * 100 || 0,
        }));
        res.json({
            success: true,
            data: result
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/overall-accuracy', protect, async(req, res) => {
    try {
        const logs = await AIModelLog.find({ transaction_id: { $ne: null } });
        const total = logs.length;
        if(total === 0) {
            return res.json({
                success: true,
                data: { overall_accuracy: 0 }
            });
        }
        const correct = logs.filter((log) => log.status === 'Correct' || (log.actual_category && log.actual_category === log.predicted_category)).length;
        const overall_accuracy = (correct / total) * 100;
        res.json({
            success: true,
            data: { overall_accuracy }
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;