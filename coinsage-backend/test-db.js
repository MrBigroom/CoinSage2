const mongoose = require('mongoose');
require('dotenv').config();

const testDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Check if database exists
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(db => db.name === 'coinsage');
    console.log(`✅ Database 'coinsage' exists: ${dbExists}`);

    // Create a test document
    const testCollection = mongoose.connection.db.collection('testcollection');
    await testCollection.insertOne({
      test: 'This is a test document',
      timestamp: new Date()
    });
    console.log('✅ Test document inserted successfully');

    // Read the test document
    const documents = await testCollection.find({}).toArray();
    console.log('✅ Test documents retrieved:', documents);

    // Clean up
    await testCollection.deleteMany({});
    console.log('✅ Test documents cleaned up');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
};

testDB();