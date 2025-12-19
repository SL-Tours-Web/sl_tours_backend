import Hotel from '../models/Hotel.js';

export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().populate('destinationId');
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        const savedHotel = await hotel.save();
        res.status(201).json(savedHotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(updatedHotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteHotel = async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json({ message: 'Hotel deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
