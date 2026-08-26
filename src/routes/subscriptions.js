const express = require('express');
const {
	createSubscription, getMemberSubscription, updateSubscription, cancelSubscription, checkSubscriptionStatus, checkSubscriptionExpiration
} = require('../controllers/subscriptions');

const router = express.Router();

// REMINDER: We should add Admin Auth middleware here
router.post("/create", createSubscription); // Should trigger after successful payment

router.get('/member/:memberId', getMemberSubscription);

router.put('/:id', updateSubscription);

router.post('/:id/cancel', cancelSubscription);

router.get('/:id/status', checkSubscriptionStatus);

router.get('/:id/expiration', checkSubscriptionExpiration); // Used for dashboard alerts (e.g., "5 days left to renew!")

module.exports = router;