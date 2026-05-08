import mongoose from 'mongoose';

const dayItinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String },
  activities: { type: String },
}, { _id: false });

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  duration: { type: String, required: true },
  itinerary: [dayItinerarySchema],
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
  transport: { type: String },
  accommodation: { type: String },
  description: { type: String },
  image: { type: String },
  images: [{ type: String }],
  highlights: [{ type: String }],
  includes: [{ type: String }],
  excludes: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);
export default Package;
