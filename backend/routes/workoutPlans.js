const express = require("express");
const { createWorkoutPlan, getAllWorkoutPlans, getWorkoutPlanById, getMemberWorkoutPlans, updateWorkoutPlan, deleteWorkoutPlan } = require("../controllers/workoutPlans");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/create", auth, createWorkoutPlan);
router.get("/", auth, authorizeRoles("admin", "super_admin", "trainer"), getAllWorkoutPlans);
router.get("/member/:memberId", auth, getMemberWorkoutPlans);
router.get("/:id", auth, getWorkoutPlanById);
router.put("/:id", auth, updateWorkoutPlan);
router.delete("/:id", auth, deleteWorkoutPlan);

module.exports = router;