import express from 'express';
import {
    getAllPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
} from '../controllers/packageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.post('/', authMiddleware, createPackage);
router.put('/:id', authMiddleware, updatePackage);
router.delete('/:id', authMiddleware, deletePackage);

export default router;
