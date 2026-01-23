import express from 'express';
import { groupCreation,getGroupDetails,getJoinCode, joinGroup,getGroupsById } from './group.controller.js';

const router = express.Router();

router.post('/create', groupCreation);
// router.get('/:groupId', getGroupDetails);
router.get('/join/:joinCode', getJoinCode);
router.post('/join', joinGroup);
router.get('/:id', getGroupsById);


export default router;