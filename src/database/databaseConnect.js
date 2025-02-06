import * as mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Ensure .env is loaded first

const MONGO_URI = process.env.MONGODB_URL;


if (!MONGO_URI) {
    throw new Error("❌ MongoDB URI is not defined in environment variables!");
}

const connectDB = async () => {
    try { 
        const connectionInstance = await mongoose.connect(MONGO_URI, {
            dbName: "myDatabase",
            serverApi: { version: '1', strict: true, deprecationErrors: true }
        });

        console.log(`✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;