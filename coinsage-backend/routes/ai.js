const express = require('express');
const router = express.Router();
const AIModelLog = require('../models/AIModelLog');
const Category = require('../models/Category');
const axios = require('axios');
const { protect } = require('../middlewares/auth');
const Transactions = require('../models/Transactions');

router.post('/categorise', protect, async(req, res) => {
    try{
        const { transaction_id, description, amount } = req.body;
        const aiResponse = await axios.post('http://localhost:5001/categorise', {
            description,
            amount
        });
        const { category, confidence } = aiResponse.data;
        const categoryDoc = await Category.findOne({ name: category });
        if(!categoryDoc) {
            return res.status(400).json({
                success: false,
                message: 'AI-predicted category not found'
            });
        }

        const log = await AIModelLog.create({
            transaction_id,
            category_id: categoryDoc._id,
            predicted_category: category,
            confidence_score: confidence
        });
        res.json({
            success: true,
            data: {
                category: categoryDoc,
                confidence,
                log
            }
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('./logs', protect, async(req, res) => {
    try{
        const logs = await AIModelLog.find({ transaction_id: {$in: await Transactions.find({ user_id: req.user._id }).distinct('_id') }})
                                        .populate('category_id', 'name type')
                                        .sort({ created_at: -1 });
        res.json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch(error) {
        res.status.json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;