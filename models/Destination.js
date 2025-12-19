import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Destination name is required'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [10, 'Description must be at least 10 characters'],
        },
        district: {
            type: String,
            required: [true, 'District is required'],
        },
        province: {
            type: String,
            required: [true, 'Province is required'],
        },
        bestTimeToVisit: {
            type: String,
            required: [true, 'Best time to visit is required'],
        },
        activities: {
            type: [String],
            default: [],
        },
        imageUrl: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
