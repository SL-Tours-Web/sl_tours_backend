import express from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, upload.single('image'), createCategory);
router.put('/:id', authMiddleware, upload.single('image'), updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
