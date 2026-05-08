import Package from '../models/Package.js';

const parseArrayField = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
};

export const getAllPackages = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
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
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPackage = async (req, res) => {
  try {
    const body = { ...req.body };
    body.highlights = parseArrayField(body.highlights);
    body.includes = parseArrayField(body.includes);
    body.excludes = parseArrayField(body.excludes);
    body.itinerary = typeof body.itinerary === 'string' ? JSON.parse(body.itinerary) : (body.itinerary || []);

    if (req.files?.image?.[0]) body.image = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.images) body.images = req.files.images.map(f => `/uploads/${f.filename}`);

    const pkg = new Package(body);
    const saved = await pkg.save();
    await saved.populate('category');
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const body = { ...req.body };
    body.highlights = parseArrayField(body.highlights);
    body.includes = parseArrayField(body.includes);
    body.excludes = parseArrayField(body.excludes);
    body.itinerary = typeof body.itinerary === 'string' ? JSON.parse(body.itinerary) : (body.itinerary || []);

    if (req.files?.image?.[0]) body.image = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.images) body.images = req.files.images.map(f => `/uploads/${f.filename}`);

    const updated = await Package.findByIdAndUpdate(req.params.id, body, { new: true }).populate('category');
    if (!updated) return res.status(404).json({ message: 'Package not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Package not found' });
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
