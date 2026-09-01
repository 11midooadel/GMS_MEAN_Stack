const HealthRecord = require('../models/healthRecord');
const User = require('../models/users');

exports.createHealthRecord = async (req, res, next) => {
	try {
		const data = { ...req.body };
		if (req.user.role === "Member") data.memberId = req.user.userId;
		const record = await HealthRecord.create(data);
		res.status(201).json({ message: 'Health record created', data: record });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getMemberHealthHistory = async (req, res, next) => {
	try {
		if (req.user.role === "Member" && req.params.memberId !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You are not allowed to view these health records" });
		}
		if (req.user.role === "Trainer") {
			const member = await User.findById(req.params.memberId).select("assignedTrainer");
			if (!member || !member.assignedTrainer || member.assignedTrainer.toString() !== req.user.userId.toString()) {
				return res.status(403).json({ message: "You are not allowed to view these health records" });
			}
		}
		// Fetch all records for the member, sorted newest to oldest
		const history = await HealthRecord.find({ memberId: req.params.memberId }).sort({ date: -1 });
		res.status(200).json({ message: 'Health history retrieved', count: history.length, data: history });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.updateHealthRecord = async (req, res, next) => {
	try {
		const existing = await HealthRecord.findById(req.params.id);
		if (!existing) return res.status(404).json({ message: 'Record not found' });
		if (req.user.role === "Member" && existing.memberId.toString() !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You are not allowed to modify this health record" });
		}
		if (req.user.role === "Member") delete req.body.memberId;
		const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, {
			new: true, runValidators: true
		});
		res.status(200).json({ message: 'Health record updated', data: record });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteHealthRecord = async (req, res, next) => {
	try {
		const record = await HealthRecord.findById(req.params.id);
		if (!record) return res.status(404).json({ message: 'Record not found' });
		if (req.user.role === "Member" && record.memberId.toString() !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You are not allowed to delete this health record" });
		}
		await HealthRecord.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'Health record deleted' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};