const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
	memberId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // References the base User model (Member discriminator)
		required: true
	},
	date: {
		type: Date,
		default: Date.now,
		required: true
	},
	weight: {
		type: Number,
		required: true // in kilograms
	},
	height: {
		type: Number, // in centimeters
		required: true
	},
	bodyFatPercentage: {
		type: Number
	},
	muscleMass: {
		type: Number
	},
	notes: {
		type: String,
		trim: true
	}
}, { timestamps: true });

HealthRecordSchema.index({ memberId: 1, date: -1 }); // Performance Best Practice: Compound index for fast history fetching and sorting

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);