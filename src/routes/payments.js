const express = require("express");
const { createPayment, getAllPayments, getPaymentById, getMemberPayments, getPaymentHistory, updatePaymentStatus } = require("../controllers/payments");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/create", auth, authorizeRoles("Admin", "Super Admin"), createPayment);
router.get("/", auth, authorizeRoles("Admin", "Super Admin"), getAllPayments);
router.get("/history", auth, authorizeRoles("Admin", "Super Admin"), getPaymentHistory);
router.get("/member/:memberId", auth, getMemberPayments);
router.patch("/:id/status", auth, authorizeRoles("Admin", "Super Admin"), updatePaymentStatus);
router.get("/:id", auth, getPaymentById);


module.exports = router;