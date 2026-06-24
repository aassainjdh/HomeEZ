const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Atlas Database Connection Error: ${error.message}`);
    console.log('Attempting local MongoDB fallback (mongodb://127.0.0.1:27017/homeez)...');
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/homeez', {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
    } catch (localError) {
      console.error(`Local Fallback Error: ${localError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
