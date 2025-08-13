const mongoose = require('mongoose');

module.exports = function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/myprojectDB';

  
  mongoose
    .connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      
    });

  mongoose.connection.on('error', (err) => {
    console.error('Mongo connection error:', err);
  });
};
