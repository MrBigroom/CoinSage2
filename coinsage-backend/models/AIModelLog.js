const mongoose = require('mongoose');

const aiModelLogSchema = new mongoose.Schema({
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transactions',
        required: true,
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
    confidence_score: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

aiModelLogSchema.index({ transaction_id: 1 });
aiModelLogSchema.index({ created_at: -1 });

module.exports = mongoose.model('AIModelLog', aiModelLogSchema);