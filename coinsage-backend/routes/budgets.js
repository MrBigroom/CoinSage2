const express = require('express')
const router = express.Router();
const Budgets = require('../models/Budgets');
const { protect } = require('../middlewares/auth');

router.get('/', protect, async(req, res) => {
    try {
        const budgets = await Budgets.find({ user_id: req.user._id })
                                        .populate('category_id', 'name type')
                                        .sort({ start_date: -1 });
        res.json({
            success: true,
            count: budgets.length,
            data: budgets
        });
    } catch(error) {
        res.status(500).json({
            success: true,
            message: error.message
        });
    }
});

router.post('/', protect, async(req, res) => {
    try {
        const { category_id, budget_amount, start_date, end_date } = req.body;
        const budget = await Budgets.create({
            user_id: req.user._id,
            category_id,
            budget_amount,
            start_date,
            end_date
        });
        res.status(201).json({
            success: true,
            data: budget
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
});

router.put('/:id', protect, async(req, res) => {
    try {
        const budget = await Budgets.findOne({ _id: req.params.id, user_id: req.user._id });
        if(!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }
        Object.assign(budget, req.body);
        await budget.save();
        res.json({
            success: true,
            data: budget
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
        const budget = await Budgets.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        if(!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }
        res.json({
            success: true,
            message: 'Budget deleted'
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;