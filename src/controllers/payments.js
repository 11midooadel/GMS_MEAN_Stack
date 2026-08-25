const Payment = require("../models/payments");
const Subscription = require("../models/subscriptions");


const createPayment = async (req, res) => {
	try {
		const { memberId, subscriptionId, amount, paymentMethod, transactionId } = req.body;

		if (!memberId || !subscriptionId || !amount || !paymentMethod) {
			return res.status(400).json({
				message: "memberId, subscriptionId, amount and paymentMethod are required"
			});
		}

		const subscription = await Subscription.findById(subscriptionId);

		if (!subscription) {
			return res.status(404).json({
				message: "Subscription not found"
			});
		}

		const payment = await Payment.create({
			memberId,
			subscriptionId,
			amount,
			paymentMethod,
			transactionId,
			status: "Completed"
		});

		subscription.paymentId = payment._id;
		subscription.status = "Active";

		await subscription.save();

		res.status(201).json({
			message: "Payment created successfully",
			data: payment
		});

	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
};


// Get All Payments
const getAllPayments = async (req, res) => {
	try {
		const payments = await Payment.find()
			.populate("memberId", "userName email")
			.populate("subscriptionId");

		res.status(200).json({
			data: payments
		});

	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
};


// Get Payment by ID
const getPaymentById = async (req, res) => {
	try {
		const payment = await Payment.findById(req.params.id)
			.populate("memberId", "userName email")
			.populate("subscriptionId");

		if (!payment) {
			return res.status(404).json({
				message: "Payment not found"
			});
		}

		res.status(200).json({
			data: payment
		});

	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
};


// Get Member Payments
const getMemberPayments = async (req, res) => {
	try {
		const payments = await Payment.find({
			memberId: req.params.memberId
		})
			.populate("subscriptionId")
			.sort({ paymentDate: -1 });

		res.status(200).json({
			data: payments
		});

	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
};


// Get Payment History
const getPaymentHistory = async (req, res) => {
	try {
		const payments = await Payment.find()
			.populate("memberId", "userName email")
			.populate("subscriptionId")
			.sort({ paymentDate: -1 });

		res.status(200).json({
			data: payments
		});

	} catch (err) {
		res.status(500).json({
			message: err.message
		});
	}
};


module.exports = {
	createPayment,
	getAllPayments,
	getPaymentById,
	getMemberPayments,
	getPaymentHistory
};