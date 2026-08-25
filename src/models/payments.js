const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
	{
		memberId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true
		},

		subscriptionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subscription",
			required: true
		},

		amount: {
			type: Number,
			required: true,
			min: 0
		},

		paymentMethod: {
			type: String,
			enum: ["Cash", "Card", "Installment"],
			required: true
		},

		status: {
			type: String,
			enum: ["Pending", "Completed", "Failed", "Refunded"],
			default: "Pending"
		},

		transactionId: {
			type: String,
			unique: true,
			sparse: true
		},

		paymentDate: {
			type: Date,
			default: Date.now
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Payment", paymentSchema);