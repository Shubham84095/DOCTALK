import mongoose from 'mongoose';
import 'dotenv/config';


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default connectDB;