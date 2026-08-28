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
  authorizeRoles("Super Admin", "Admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin",
    });
  }
);

module.exports = router;