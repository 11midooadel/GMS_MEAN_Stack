const express = require('express');
const { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan, disablePlan, enablePlan } = require('../controllers/plans');
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

// REMINDER: We should add Admin Auth middleware here
router.post("/create", auth, authorizeRoles("Admin", "Super Admin"), createPlan);
router.get("/view", auth, getAllPlans);
router.get("/view/:id", auth, getPlanById);
router.put("/update/:id", auth, authorizeRoles("Admin", "Super Admin"), updatePlan);
router.put("/disable/:id", auth, authorizeRoles("Admin", "Super Admin"), disablePlan);
router.put("/enable/:id", auth, authorizeRoles("Admin", "Super Admin"), enablePlan);
router.delete("/delete/:id", auth, authorizeRoles("Admin", "Super Admin"), deletePlan);

module.exports = router;