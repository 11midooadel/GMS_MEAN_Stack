const HealthRecord = require('../models/healthRecord');

exports.createHealthRecord = async (req, res, next) => {
	try {
		const record = await HealthRecord.create(req.body);
		res.status(201).json({ message: 'Health record created', data: record });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getMemberHealthHistory = async (req, res, next) => {
	try {
		// Fetch all records for the member, sorted newest to oldest
		const history = await HealthRecord.find({ memberId: req.params.memberId }).sort({ date: -1 });
		res.status(200).json({ message: 'Health history retrieved', count: history.length, data: history });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.updateHealthRecord = async (req, res, next) => {
	try {
		const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, {
			new: true, runValidators: true
		});
		if (!record) return res.status(404).json({ message: 'Record not found' });
		res.status(200).json({ message: 'Health record updated', data: record });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteHealthRecord = async (req, res, next) => {
	try {
		const record = await HealthRecord.findByIdAndDelete(req.params.id);
		if (!record) return res.status(404).json({ message: 'Record not found' });
		res.status(200).json({ message: 'Health record deleted' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};