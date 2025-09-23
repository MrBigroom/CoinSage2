const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Check if database exists
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(db => db.name === 'coinsage');
    console.log(`Database 'coinsage' exists: ${dbExists}`);
    
    // Check if categories collection exists and has documents
    const collections = await mongoose.connection.db.listCollections().toArray();
    const categoriesExists = collections.some(col => col.name === 'categories');
    console.log(`Collection 'categories' exists: ${categoriesExists}`);
    
    if (categoriesExists) {
      const count = await mongoose.connection.db.collection('categories').countDocuments();
      console.log(`Number of documents in categories: ${count}`);
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
};

testConnection();