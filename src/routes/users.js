const express = require("express");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/users");

const router = express.Router();

router.post("/create", createUser);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUserById);

router.delete("/:id", deleteUserById);

module.exports = router;