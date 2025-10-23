const express = require('express');
const router = express.Router();
const AIModelLog = require('../models/AIModelLog');
const Category = require('../models/Category');
const axios = require('axios');
const { protect } = require('../middlewares/auth');
const Transactions = require('../models/Transactions');

router.post('/categorise', protect, async(req, res) => {
    try{
        const { transaction_id, title, transaction_amount } = req.body;
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/categorise`, {
            title,
            amount: transaction_amount
        });
        const { category, confidence } = aiResponse.data;
        
        res.json({
            success: true,
            data: {
                category: category,
                confidence
            }
        });
    } catch(error) {
        console.error('Categorise error: ', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/logs', protect, async(req, res) => {
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;