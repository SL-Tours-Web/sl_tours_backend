import express from 'express';
import {
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage
} from '../controllers/packageController.js';

const router = express.Router();

router.get('/', getAllPackages);
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

export default router;
