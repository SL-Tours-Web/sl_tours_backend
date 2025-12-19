import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    destinationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
    bookingLink: {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
}, {
    timestamps: true,
});

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
