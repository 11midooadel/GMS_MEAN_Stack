const Plan = require('../models/plans');

exports.createPlan = async (req, res, next) => {
	try {
		const plan = await Plan.create(req.body);
		res.status(201).json({ message: 'Plan created successfully', data: plan });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getAllPlans = async (req, res, next) => {
	try {
		// By default, only return active plans. Admins might pass a query like ?all=true
		const query = req.query.all ? {} : { isActive: true };
		const plans = await Plan.find(query);
		res.status(200).json({ message: 'Plans fetched successfully', count: plans.length, data: plans });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getPlanById = async (req, res, next) => {
	try {
		const plan = await Plan.findById(req.params.id);
		if (!plan) return res.status(404).json({ message: 'Plan not found' });
		res.status(200).json({ message: 'Plan fetched successfully', data: plan });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updatePlan = async (req, res, next) => {
	try {
		const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // Returns the updated document
			runValidators: true // Ensures schema rules are still applied
		});
		if (!plan) return res.status(404).json({ message: 'Plan not found' });
		res.status(200).json({ message: 'Plan updated successfully', data: plan });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.disablePlan = async (req, res, next) => {
	try {
		// Disabling a plan: sets isActive to false instead of removing it from the database
		const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
		if (!plan) return res.status(404).json({ message: 'Plan not found' });
		res.status(200).json({ message: 'Plan disabled successfully', data: plan });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.enablePlan = async (req, res, next) => {
	try {
		const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
		if (!plan) return res.status(404).json({ message: 'Plan not found' });
		res.status(200).json({ message: 'Plan enabled successfully', data: plan });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.deletePlan = async (req, res, next) => {
	try {
		const plan = await Plan.findByIdAndDelete(req.params.id);
		if (!plan) return res.status(404).json({ message: 'Plan not found' });
		res.status(200).json({ message: 'Plan deleted successfully', data: plan });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};