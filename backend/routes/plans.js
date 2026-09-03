const express = require('express');
const { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan, disablePlan, enablePlan } = require('../controllers/plans');
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

// REMINDER: We should add Admin Auth middleware here
router.post("/create", auth, authorizeRoles("admin", "super_admin"), createPlan);
router.get("/view", auth, getAllPlans);
router.get("/view/:id", auth, getPlanById);
router.put("/update/:id", auth, authorizeRoles("admin", "super_admin"), updatePlan);
router.put("/disable/:id", auth, authorizeRoles("admin", "super_admin"), disablePlan);
router.put("/enable/:id", auth, authorizeRoles("admin", "super_admin"), enablePlan);
router.delete("/delete/:id", auth, authorizeRoles("admin", "super_admin"), deletePlan);

module.exports = router;