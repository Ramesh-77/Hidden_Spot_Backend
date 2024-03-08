import mongoose from "mongoose";

// creating function to handle database
export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Hidden Spot database is connecting .....")
  } catch (error) {
    console.error("Error connecting hidden spot database", error);
  }
};
