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
                                                .populate('category_id', 'name type')
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
        const { title, transaction_amount, date, description } = req.body;
        let { category_id } = req.body;

        const aiResponse = await axios.post('http://localhost:5001/categorise', {
            description,
            amount: transaction_amount
        });
        const { category, confidence } = aiResponse.data;
        const categoryDoc = await Category.findOne({ name: category });
        if(!categoryDoc) {
            return res.status(400).json({
                success: false,
                message: 'AI-predicted category not found'
            });
        }
        category_id = categoryDoc._id;

        await AIModelLog.create({
            transaction_id: null,
            category_id,
            predicted_category: category,
            confidence_score: confidence
        });

        const transaction = await Transactions.create({
            user_id: req.user_id,
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

        await Budgets.updateMany(
            {
                user_id: req.user._id,
                category_id,
                start_date: { $lte: transaction.date },
                end_date: { $gte: transaction.date }
            },
            { $inc: { spent_amount: transaction_amount } }
        );
        res.status(201).json({ success: true, data: transaction });
    } catch(error) {
        res.status(400).json({ success: false, message: error.messge });
    }
});

router.put('/:id', protect, async(req, res) => {
    try {
        const transaction = await Transactions.findOne({ _id: req.params.id, user_id: req.user._id });
        if(!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        Object.assign(transaction, req.body);
        await transaction.save();
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

module.exports = router;