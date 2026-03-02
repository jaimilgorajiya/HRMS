import mongoose from "mongoose";
import 'dotenv/config';

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ems");
    console.log("Connected to MongoDB");

    // Drop all old indexes
    await mongoose.connection.db.collection('departments').dropIndexes();
    console.log("Dropped all indexes for departments");

    // Delete departments that don't have a branchId (old data)
    const result = await mongoose.connection.db.collection('departments').deleteMany({
      branchId: { $exists: false }
    });
    console.log(`Deleted ${result.deletedCount} old departments without branchId.`);

    process.exit(0);
  } catch (error) {
    console.error("Cleanup Error:", error);
    process.exit(1);
  }
};

cleanup();
