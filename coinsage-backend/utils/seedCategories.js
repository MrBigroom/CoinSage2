const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
    { name: 'Groceries', type: 'Expense' },
    { name: 'Utilities', type: 'Expense' },
    { name: 'Transport', type: 'Expense' },
    { name: 'Food & Beverages', type: 'Expense' },
    { name: 'Entertainment', type: 'Expense' },
    { name: 'Healthcare', type: 'Expense' },
    { name: 'Education', type: 'Expense' },
    { name: 'Travel', type: 'Expense' },
    { name: 'Gifts', type: 'Expense' },
    { name: 'Salary', type: 'Income' },
    { name: 'Commission', type: 'Income' },
    { name: 'Reimbursement', type: 'Income' },
    { name: 'Investment', type: 'Income' }
];

const seedCategories = async() => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully');
        
        console.log('Deleting existing categories...');
        const deleteResult = await Category.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} categories`);
        
        console.log('Inserting new categories...');
        const result = await Category.insertMany(categories);
        console.log(`✅ Inserted ${result.length} categories successfully`);
        
        // Verify the insertion
        const count = await Category.countDocuments();
        console.log(`Total categories in database: ${count}`);
        
        // Show the first few categories
        const sampleCategories = await Category.find().limit(3);
        console.log('Sample categories:', sampleCategories);
        
        await mongoose.connection.close();
        console.log('Connection closed');
        
    } catch(error) {
        console.error("❌ Error seeding categories: ", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
};

seedCategories();