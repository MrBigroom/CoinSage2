const mongoose = require('mongoose');

const aiModelLogSchema = new mongoose.Schema({
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transactions',
        required: false
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    predicted_category: {
        type: String,
        required: true
    },
    actual_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    confidence_score: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    status: {
        type: String,
        enum: ['Correct', 'Incorrect'],
        default: 'Correct'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

aiModelLogSchema.index({ transaction_id: 1 });
aiModelLogSchema.index({ created_at: -1 });

module.exports = mongoose.model('AIModelLog', aiModelLogSchema);