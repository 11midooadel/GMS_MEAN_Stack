const express = require('express');
const router = express.Router();
const membersController = require('../controllers/members');

router.post('/', membersController.createMember);
router.get('/', membersController.getAllMembers);
router.get('/:id', membersController.getMemberById);
router.put('/:id', membersController.updateMember);
router.delete('/:id', membersController.deleteMember);
router.post('/assign-trainer', membersController.assignTrainer);

// MUST BE HERE
module.exports = router;