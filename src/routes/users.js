const express = require("express");
const router = express.Router();
module.exports = router;

const { createUser, loginUser } = require("../controllers/users");

router.post("/create", createUser);

router.post("/login", loginUser);