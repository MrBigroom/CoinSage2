const express = require('express')
const router = express.Router();
const Budgets = require('../models/Budgets');
const { protect } = require('../middlewares/auth');

router.get('/', protect, async(req, res) => {
    try {
        const budgets = await Budgets.find({ user_id: req.user._id }).populate('category_id', 'name');
        res.json({
            success: true,
            data: budgets
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
        const { category_id, budget_amount, start_date, end_date } = req.body;
        const budget = await Budgets.create({
            user_id: req.user._id,
            category_id,
            budget_amount,
            start_date,
            end_date
        });
        await budget.save();
        const populatedBudget = await Budgets.findById(budget._id).populate('category_id', 'name');
        res.status(201).json({
            success: true,
            data: populatedBudget
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
        const { category_id, budget_amount, start_date, end_date } = req.body;
        const budget = await Budgets.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            { category_id, budget_amount, start_date, end_date },
            { new: true }
        ).populate('category_id', 'name');
        if(!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }
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