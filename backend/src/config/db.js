

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(conn,'MongoDB')
    if (conn.connection) {
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } else {
      console.log("⚠️ MongoDB connected but no host info");
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
