import express from 'express';
import { groupCreation,getGroupDetails } from './group.controller.js';

const router = express.Router();

router.post('/create', groupCreation);
router.get('/:groupId', getGroupDetails);

export default router;