// db/connect.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 'mongodb://admin:password@localhost:27017/homeglam?authSource=admin'
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/homeglam', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
