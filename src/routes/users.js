const express = require('express');
const { register, login, getProfile } = require("../controllers/users");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, assignTrainer } = require('../controllers/users');
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");
const authorizeOwnerOrAdmin = require("../middleware/authorizeOwnerOrAdmin");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
// router.get("/admin-test", auth, authorizeRoles("Admin"), (req, res) => {
//   res.status(200).json({ message: "Welcome Admin", });
// }
// );

router.post('/', auth, authorizeRoles("Admin", "Super Admin"),createUser);
router.get("/", auth, authorizeRoles("Admin", "Super Admin"), getAllUsers);
router.put("/assign-trainer", auth, authorizeRoles("Admin", "Super Admin"), assignTrainer);
router.get("/:id", auth, authorizeRoles("Admin", "Super Admin"), getUserById);
router.put('/:id', auth, authorizeOwnerOrAdmin, updateUser);
router.delete('/:id', auth, authorizeOwnerOrAdmin, deleteUser);

module.exports = router;