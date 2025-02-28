import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();  // check the env for MONGODB_URI


mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooksdb"
);

export default mongoose.connection;
