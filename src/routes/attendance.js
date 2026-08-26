const express = require("express");

const { checkIn, checkOut, getMyAttendance, getAttendanceByUser } = require("../controllers/attendance");

const router = express.Router();

router.post("/check-in", checkIn);
router.put("/check-out", checkOut);
router.get("/my-attendance", getMyAttendance);
router.get("/user/:userId", getAttendanceByUser);

module.exports = router;