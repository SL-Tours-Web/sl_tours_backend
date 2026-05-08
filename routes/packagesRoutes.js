import express from 'express';
import { getAllPackages, getPackageById, createPackage, updatePackage, deletePackage } from '../controllers/packageController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

const pkgUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.post('/', authMiddleware, pkgUpload, createPackage);
router.put('/:id', authMiddleware, pkgUpload, updatePackage);
router.delete('/:id', authMiddleware, deletePackage);

export default router;
