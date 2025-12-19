import Destination from '../models/Destination.js';

// @desc    Get all destinations
// @route   GET /api/destinations
export const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get destination by ID
// @route   GET /api/destinations/:id
export const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Create a new destination
// @route   POST /api/destinations
export const createDestination = async (req, res) => {
    try {
        const destination = new Destination(req.body);
        const savedDestination = await destination.save();
        res.status(201).json(savedDestination);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
export const updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.status(200).json(destination);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
export const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.status(200).json({ message: 'Destination deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
