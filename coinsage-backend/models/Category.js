const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true
    }
});

module.exports = mongoose.model('Category', categorySchema);