const Subscription = require('../models/subscriptions');
const Plan = require('../models/plans');

const createSubscription = async (req, res, next) => {
	try {
		// 1. Validate the plan exists
		const plan = await Plan.findById(req.body.planId);
		if (!plan || !plan.isActive) {
			return res.status(400).json({ message: 'Invalid or inactive plan' });
		}
		
		// 2. Check admin role for creating subscriptions for other members
		if (req.user.role !== "Admin" && req.user.role !== "Super Admin") {
			return res.status(403).json({ message: "Only admin can create subscriptions for other members" });
		}

		// 3. Create the subscription (endDate is calculated automatically by the Mongoose pre-validate hook)
		const subscription = await Subscription.create(req.body);
		res.status(201).json({ data: subscription });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAllSubscriptions = async (req, res, next) => {
	try {
		const subscriptions = await Subscription.find()
			.populate('memberId', 'name email') // Joins the member details for the Admin view
			.populate('planId', 'name features durationInDays price') 
			.sort({ createdAt: -1 });
		res.status(200).json({ data: subscriptions });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getMemberSubscription = async (req, res, next) => {
	try {
		// Find all subscriptions for a specific member, sort by most recent first
		if (req.user.role === "Member" && req.params.memberId !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You can only view your own subscriptions" });
		}
		const subscriptions = await Subscription.find({ memberId: req.params.memberId }).populate('planId', 'name features durationInDays price') // Joins the plan details.sort({ createdAt: -1 });
		res.status(200).json({ data: subscriptions });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateSubscription = async (req, res, next) => {
	try {
		const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
			new: true, runValidators: true
		});
		if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
		res.status(200).json({ data: subscription });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const cancelSubscription = async (req, res, next) => {
	try {
		const subscription = await Subscription.findByIdAndUpdate(req.params.id,
			{ status: 'Cancelled', endDate: Date.now() }, // Instantly expires it
			{ new: true }
		);
		if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
		if (req.user.role === "Member" && subscription.memberId.toString() !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You can only cancel your own subscription" });
		}
		res.status(200).json({ message: 'Subscription cancelled', data: subscription });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// REMINDER: We need to discuss how to handle frozen subscriptions.

const checkSubscriptionStatus = async (req, res, next) => {
	try {
		const subscription = await Subscription.findById(req.params.id);
		if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

		if (req.user.role === "Member" && subscription.memberId.toString() !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You can only check your own subscription" });
		}

		// If endDate has passed, automatically update status to 'Expired'
		let currentStatus = subscription.status;
		if (subscription.endDate < Date.now() && currentStatus === 'Active') {
			subscription.status = 'Expired';
			await subscription.save();
			currentStatus = 'Expired';
		}

		res.status(200).json({ status: currentStatus });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const checkSubscriptionExpiration = async (req, res, next) => {
	try {
		const subscription = await Subscription.findById(req.params.id);
		if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

		if (req.user.role === "Member" && subscription.memberId.toString() !== req.user.userId.toString()) {
			return res.status(403).json({ message: "You can only check your own subscription" });
		}
		// Calculate days remaining
		const timeDiff = subscription.endDate.getTime() - Date.now();
		const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert ms to days

		res.status(200).json({
			daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
			isExpired: daysRemaining <= 0,
			endDate: subscription.endDate
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createSubscription,
	getAllSubscriptions,
	getMemberSubscription,
	updateSubscription,
	cancelSubscription,
	checkSubscriptionStatus,
	checkSubscriptionExpiration,
};