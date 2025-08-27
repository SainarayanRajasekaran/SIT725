const express = require('express');
const path = require('path');
const { connectDB } = require('./config');    
const { quoteRouter } = require('./routes');   

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api', quoteRouter);

//If condition to check server from starting during tests
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
