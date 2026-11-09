const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/saasflow';
    
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`💡 Tip: Ensure MongoDB is running locally on port 27017, or set MONGO_URI in backend/.env to your MongoDB Atlas connection string.`);
    // Do not crash the entire server in development so API endpoints can still serve descriptive error state
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
