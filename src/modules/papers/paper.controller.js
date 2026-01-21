import { validationResult } from 'express-validator';
import paperService from './paper.service.js';
function handleValidationErrors(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors.array();
    throw err;
  }
}

// Create a new paper
async function createPaper(req, res, next) {
  try {
    handleValidationErrors(req);

    const { title, content_text, metadata } = req.body;
    // file is optional and comes from multer as req.file
    const file = req.file;

    const created = await paperService.createPaper({
      title,
      content_text,
      metadata: metadata ? JSON.parse(metadata) : undefined,
      file
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// List papers with pagination (optional)
async function listPapers(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = Math.min(parseInt(req.query.pageSize || '20', 10), 100);
    const result = await paperService.listPapers({ page, pageSize });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Get single paper
async function getPaper(req, res, next) {
  try {
    handleValidationErrors(req);
    const { id } = req.params;
    const paper = await paperService.getPaperById(id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    res.json(paper);
  } catch (err) {
    next(err);
  }
}

// Update paper
async function updatePaper(req, res, next) {
  try {
    handleValidationErrors(req);

    const { id } = req.params;
    const { title, content_text, metadata } = req.body;
    const file = req.file;

    const updated = await paperService.updatePaper(id, {
      title,
      content_text,
      metadata: metadata ? JSON.parse(metadata) : undefined,
      file
    });

    if (!updated) return res.status(404).json({ error: 'Paper not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Delete paper
async function deletePaper(req, res, next) {
  try {
    handleValidationErrors(req);
    const { id } = req.params;
    const deleted = await paperService.deletePaper(id);
    if (!deleted) return res.status(404).json({ error: 'Paper not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// module.exports = {
//   createPaper,
//   listPapers,
//   getPaper,
//   updatePaper,
//   deletePaper
// };

export default {
  createPaper,
  listPapers,
  getPaper,
  updatePaper,
  deletePaper
}