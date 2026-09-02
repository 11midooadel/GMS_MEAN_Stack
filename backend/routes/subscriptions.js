const express = require('express');
const { createSubscription, getAllSubscriptions, getMemberSubscription, updateSubscription, cancelSubscription, checkSubscriptionStatus, checkSubscriptionExpiration } = require('../controllers/subscriptions');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

const router = express.Router();

// REMINDER: We should add Admin Auth middleware here
router.post("/create", auth, authorizeRoles("Super Admin", "Admin"), createSubscription); // Should trigger after successful payment
router.get('/', auth, authorizeRoles("Super Admin", "Admin"), getAllSubscriptions);
router.get('/member/:memberId', auth, getMemberSubscription);
router.put('/:id', auth, authorizeRoles("Super Admin", "Admin"), updateSubscription);
router.post('/:id/cancel', auth, cancelSubscription);
router.get('/:id/status', auth, checkSubscriptionStatus);
router.get('/:id/expiration', auth, checkSubscriptionExpiration); // Used for dashboard alerts (e.g., "5 days left to renew!")

module.exports = router;