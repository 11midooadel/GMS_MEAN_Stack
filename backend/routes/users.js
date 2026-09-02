const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// PUBLIC ENDPOINTS
router.post('/register', userController.registerUser || userController.createUser);
router.post('/login', userController.loginUser || userController.login);

// PROTECTED ENDPOINTS
router.use(auth);

router.get('/profile', userController.getProfile || userController.getUserById);
router.get('/', userController.getAllUsers || userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;