const express = require('express');
const router = express.Router();

// Combined controller imports
const {
  register,
  login,
  getProfile,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignTrainer
} = require('../controllers/users');

// Middleware imports
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const authorizeOwnerOrAdmin = require('../middleware/authorizeOwnerOrAdmin');

// =======================
// Public Routes
// =======================
router.post('/register', register);
router.post('/login', login);

// =======================
// Authenticated User Routes
// =======================
router.get('/profile', auth, getProfile);

// =======================
// Admin / Super Admin Routes
// =======================
router.post('/', auth, authorizeRoles('Admin', 'Super Admin'), createUser);
router.get('/', auth, authorizeRoles('Admin', 'Super Admin'), getAllUsers);
router.put('/assign-trainer', auth, authorizeRoles('Admin', 'Super Admin'), assignTrainer);

// =======================
// Specific User ID Routes (Keep below specific word routes like /assign-trainer)
// =======================
router.get('/:id', auth, authorizeRoles('Admin', 'Super Admin'), getUserById);
router.put('/:id', auth, authorizeOwnerOrAdmin, updateUser);
router.delete('/:id', auth, authorizeOwnerOrAdmin, deleteUser);

module.exports = router;