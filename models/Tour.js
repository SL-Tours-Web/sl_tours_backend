import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Draft"],
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Tour", tourSchema);
