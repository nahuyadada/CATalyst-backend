import express from 'express';
const router = express.Router();
import multer from 'multer';
import { body, param } from 'express-validator';
import controller from './paper.controller.js';

// Use multer memoryStorage to get file buffer (we'll upload buffer to Supabase Storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max (adjust as needed)
});

// Create (accepts file and/or text)
// - fields: title (required), content_text (optional), file (optional)
router.post(
  '/',
  upload.single('file'),
  body('title').isString().trim().notEmpty().withMessage('title is required'),
  controller.createPaper
);

// Read all papers (simple list)
router.get('/', controller.listPapers);

// Read single paper by id
router.get('/:id', param('id').isUUID().withMessage('invalid id'), controller.getPaper);

// Update a paper (title optional, content_text optional, file optional)
// Accepts multipart/form-data with optional file field 'file'
router.put(
  '/:id',
  upload.single('file'),
  param('id').isUUID().withMessage('invalid id'),
  controller.updatePaper
);

// Delete a paper by id
router.delete('/:id', param('id').isUUID().withMessage('invalid id'), controller.deletePaper);

export default router;
