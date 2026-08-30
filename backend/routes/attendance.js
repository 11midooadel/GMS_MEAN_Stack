const express = require("express");
const { checkIn, checkOut, getMyAttendance, getAttendanceByUser } = require("../controllers/attendance");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.get("/check-in", auth, checkIn);
router.get("/check-out", auth, checkOut);
router.get("/my-attendance", auth, getMyAttendance);
router.get("/user/:userId", auth, authorizeRoles("Admin", "Super Admin"), getAttendanceByUser);

module.exports = router;