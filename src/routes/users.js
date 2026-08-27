<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
=======
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/users");

const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);

router.get(
  "/admin-test",
  auth,
  authorizeRoles("Admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin",
    });
  }
);
>>>>>>> origin/main

module.exports = router;