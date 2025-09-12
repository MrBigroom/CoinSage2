const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    budget_amount: {
        type: Number,
        required: true,
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    spent_amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

budgetSchema.index({ user_id: 1, category_id: 1 });
budgetSchema.index({ user_id: 1, start_date: 1, end_date: 1 });

budgetSchema.virtual('remaining_amount').get(function() {
    return this.budget_amount - this.spent_amount;
});

module.exports = mongoose.model('Budgets', budgetSchema);