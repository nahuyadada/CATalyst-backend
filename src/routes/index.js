import express from 'express';
const router = express.Router();

// modules
import paperRoutes from '../modules/papers/paper.routes.js';


// mount module routes under /papers
router.use('/papers', paperRoutes);

// default health check
router.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

export default router;
