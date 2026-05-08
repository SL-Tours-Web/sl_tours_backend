import express from 'express';
import { createInquiry, getAllInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', authMiddleware, getAllInquiries);
router.put('/:id', authMiddleware, updateInquiryStatus);
router.delete('/:id', authMiddleware, deleteInquiry);

export default router;
