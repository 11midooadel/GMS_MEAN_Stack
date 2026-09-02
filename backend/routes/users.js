const express = require('express');
const { register, login, getProfile } = require("../controllers/users");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, assignTrainer, getMyMembers } = require('../controllers/users');
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
// router.get("/admin-test", auth, authorizeRoles("Admin"), (req, res) => {
//   res.status(200).json({ message: "Welcome Admin", });
// }
// );

router.post('/', auth, authorizeRoles("Admin", "Super Admin"), createUser);
router.get("/", auth, authorizeRoles("Admin", "Super Admin"), getAllUsers);
router.put("/assign-trainer", auth, authorizeRoles("Admin", "Super Admin"), assignTrainer);
router.get("/my-members", auth, authorizeRoles("Trainer"), getMyMembers);
router.get("/:id", auth, authorizeRoles("Admin", "Super Admin"), getUserById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);
// router.get("/test-token/:id", testToken);


module.exports = router;