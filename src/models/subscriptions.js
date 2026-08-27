const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
	memberId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // References the base User model (Member discriminator)
		required: true
	},
	planId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Plan', // References the base Plan model
		required: true
	},
	paymentId: {
		type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
		ref: 'Payment' // Links to the payment receipt/transaction details
=======
		ref: 'Payment' // References the Payment model to the payment receipt/transaction details
>>>>>>> origin/main
	},
	startDate: {
		type: Date,
		required: true,
		default: Date.now
	},
	endDate: {
		type: Date,
		required: true
		// Calculated on creation: startDate + planId.durationInDays
	},
	status: {
		type: String,
		enum: ['Pending', 'Active', 'Expired', 'Cancelled', 'Frozen'],
		default: 'Pending'
	},
	frozenUntil: {
		type: Date
		// Optional: gyms often allow members to "freeze" accounts for travel/injury
	}
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Optional: Mongoose middleware to auto-calculate endDate before saving
SubscriptionSchema.pre('validate', async function () {
	if (this.isNew && this.planId && this.startDate) {
		const plan = await mongoose.model('Plan').findById(this.planId);
		if (plan) {
			const end = new Date(this.startDate);
			end.setDate(end.getDate() + plan.durationInDays);
			this.endDate = end;
		}
	}
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);