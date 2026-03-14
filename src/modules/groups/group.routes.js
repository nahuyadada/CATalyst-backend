import express from 'express';
import { groupCreation,getGroupDetails,getJoinCode, joinGroup,getGroupsById, setRequestStatus} from './group.controller.js';

const router = express.Router();

router.post('/create', groupCreation);
// router.get('/:groupId', getGroupDetails);
router.get('/join/:joinCode', getJoinCode);
router.post('/join', joinGroup);
router.get('/:id', getGroupsById);


// TODO: Implement invite groups and roles
router.post('/accept/:requestId', setRequestStatus); // get role of user in group and group details



export default router;