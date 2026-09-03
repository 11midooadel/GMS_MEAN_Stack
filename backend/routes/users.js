const express = require('express');
const { register, login, getProfile } = require("../controllers/users");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, assignTrainer, getMyMembers } = require('../controllers/users');
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");
const router = express.Router();
const userController = require('../controllers/users');
const roles = require('../middleware/roles');

// PUBLIC ENDPOINTS
router.post('/register', userController.registerUser || userController.register);
router.post('/login', userController.loginUser || userController.login);

// PROTECTED ENDPOINTS
router.use(auth);

router.get('/profile', userController.getProfile || userController.getUserById);
router.get('/', userController.getAllUsers || userController.getUsers);
router.post('/', auth, authorizeRoles('Admin', 'Super Admin'), createUser);
router.get("/my-members", auth, authorizeRoles("trainer"), getMyMembers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
// router.get("/test-token/:id", testToken);


module.exports = router;