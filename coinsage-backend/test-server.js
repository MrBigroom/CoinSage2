const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Simple server is working!' });
});

app.listen(5000, () => {
  console.log('Simple test server running on port 5000');
});