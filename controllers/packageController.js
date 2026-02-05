import Package from '../models/Package.js';

export const getAllPackages = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const packages = await Package.find(filter)
            .populate('category')
            .populate('destinations')
            .sort({ createdAt: -1 });
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id)
            .populate('category')
            .populate('destinations');
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(pkg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createPackage = async (req, res) => {
    try {
        const pkg = new Package(req.body);
        const savedPackage = await pkg.save();
        await savedPackage.populate('category');
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
        ).populate('category');
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
