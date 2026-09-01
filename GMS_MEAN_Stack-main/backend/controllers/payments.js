const Payment = require("../models/payments");
const Subscription = require("../models/subscriptions");

const createPayment = async (req, res) => {
	try {
		const { memberId, subscriptionId, amount, paymentMethod, transactionId } = req.body;
		if (!memberId || !subscriptionId || !amount || !paymentMethod) {
			return res.status(400).json({ message: "memberId, subscriptionId, amount and paymentMethod are required" });
		}

		const subscription = await Subscription.findById(subscriptionId);
		if (!subscription) {
			return res.status(404).json({ message: "Subscription not found" });
		}
		if (subscription.memberId.toString() !== memberId) {
			return res.status(403).json({ message: "This subscription does not belong to this member" });
		}

		const payment = await Payment.create({ memberId, subscriptionId, amount, paymentMethod, transactionId, status: "Completed" });
		subscription.paymentId = payment._id;
		subscription.status = "Active";
		await subscription.save();

		res.status(201).json({ message: "Payment created successfully", data: payment });

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getAllPayments = async (req, res) => {
	try {
		const payments = await Payment.find().populate("memberId", "userName email").populate("subscriptionId");
		res.status(200).json({ data: payments });

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getPaymentById = async (req, res) => {
	try {
		const payment = await Payment.findById(req.params.id).populate("memberId", "userName email").populate("subscriptionId");
		if (!payment) {
			return res.status(404).json({ message: "Payment not found" });
		}
		if (req.user.role === "Member" && payment.memberId._id.toString() !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You are not allowed to view this payment" });
		}
		res.status(200).json({ data: payment });

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getMemberPayments = async (req, res) => {
	try {
		if (req.user.role === "Member" && req.params.memberId !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You are not allowed to view these payments" });
		}
		const payments = await Payment.find({ memberId: req.params.memberId }).populate("subscriptionId").sort({ paymentDate: -1 });
		res.status(200).json({ data: payments });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getPaymentHistory = async (req, res) => {
	try {
		const payments = await Payment.find().populate("memberId", "userName email").populate("subscriptionId").sort({ paymentDate: -1 });
		res.status(200).json({ data: payments });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const updatePaymentStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const allowedStatuses = ["Pending", "Completed", "Failed", "Refunded"];
		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({ message: "Invalid payment status" });
		}

		const payment = await Payment.findByIdAndUpdate(req.params.id, { status },
			{ new: true, runValidators: true }
		);
		if (!payment) {
			return res.status(404).json({ message: "Payment not found" });
		}

		res.status(200).json({ message: "Payment status updated successfully", data: payment });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	createPayment,
	getAllPayments,
	getPaymentById,
	getMemberPayments,
	getPaymentHistory,
	updatePaymentStatus
};