import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    destinations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true,
    }],
    transport: {
        type: String,
    },
    accommodation: {
        type: String,
    },
}, {
    timestamps: true,
});

const Package = mongoose.model('Package', packageSchema);
export default Package;
