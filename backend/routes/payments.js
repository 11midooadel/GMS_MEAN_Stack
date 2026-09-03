const express = require("express");
const { createPayment, getAllPayments, getPaymentById, getMemberPayments, getPaymentHistory, updatePaymentStatus } = require("../controllers/payments");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/create", auth, authorizeRoles("admin", "super_admin"), createPayment);
router.get("/", auth, authorizeRoles("admin", "super_admin"), getAllPayments);
router.get("/history", auth, authorizeRoles("admin", "super_admin"), getPaymentHistory);
router.get("/member/:memberId", auth, getMemberPayments);
router.patch("/:id/status", auth, authorizeRoles("admin", "super_admin"), updatePaymentStatus);
router.get("/:id", auth, getPaymentById);


module.exports = router;