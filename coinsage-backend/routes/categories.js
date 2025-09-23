const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async(req, res) => {
    try {
        const categories = await Category.find();
        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;