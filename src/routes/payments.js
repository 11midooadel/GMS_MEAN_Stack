const express = require("express");
const router = express.Router();

const {
	createPayment,
	getAllPayments,
	getPaymentById,
	getMemberPayments,
	getPaymentHistory
} = require("../controllers/payments");


router.post("/create", createPayment);

router.get("/", getAllPayments);

router.get("/history", getPaymentHistory);

router.get("/member/:memberId", getMemberPayments);

router.get("/:id", getPaymentById);


module.exports = router;