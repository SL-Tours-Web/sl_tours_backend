import Package from '../models/Package.js';

export const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find().populate('destinations');
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createPackage = async (req, res) => {
    try {
        const pkg = new Package(req.body);
        const savedPackage = await pkg.save();
        res.status(201).json(savedPackage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(updatedPackage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deletePackage = async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json({ message: 'Package deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
