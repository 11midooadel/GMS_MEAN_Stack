const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
		// e.g., "Basic", "Premium"
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	durationInDays: {
		type: Number,
		required: true
		// Using days (e.g., 30, 90, 365) makes date math much easier than "months"
	},
	features: [{
		type: String
		// e.g., ["Pool access", "2 PT sessions", "Locker included"]
	}],
	isActive: {
		type: Boolean,
		default: true
		// Toggle to false when disabling a plan instead of deleting it
	}
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Plan', PlanSchema);