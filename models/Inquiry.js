import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  whatsapp: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  packageInterested: { type: String, default: 'General Inquiry', trim: true },
  travelDates: { type: String, trim: true },
  groupSize: { type: Number, default: 1 },
  message: { type: String, trim: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Closed'],
    default: 'New',
  },
  createdAt: { type: Date, default: Date.now },
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
