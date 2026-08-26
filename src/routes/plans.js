const express = require('express');
const {
	createPlan, getAllPlans, getPlanById, updatePlan, deletePlan, disablePlan, enablePlan
} = require('../controllers/plans');

const router = express.Router();

// REMINDER: We should add Admin Auth middleware here
router.post("/create", createPlan);

router.get("/view", getAllPlans);

router.get("/view/:id", getPlanById);

router.put("/update/:id", updatePlan);

router.put("/disable/:id", disablePlan);

router.put("/enable/:id", enablePlan);

router.delete("/delete/:id", deletePlan);

module.exports = router;