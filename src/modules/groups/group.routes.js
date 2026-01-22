import express from 'express';
import { groupCreation,getGroupDetails,getJoinCode, joinGroup } from './group.controller.js';

const router = express.Router();

router.post('/create', groupCreation);
router.get('/:groupId', getGroupDetails);
router.get('/join/:joinCode', getJoinCode);
router.post('/join', joinGroup);

export default router;