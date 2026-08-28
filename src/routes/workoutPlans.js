const express = require("express");

const router = express.Router();

const {
    createWorkoutPlan,
    getAllWorkoutPlans,
    getWorkoutPlanById,
    getMemberWorkoutPlans,
    updateWorkoutPlan,
    deleteWorkoutPlan
} = require("../controllers/workoutPlans");

router.post("/create", createWorkoutPlan);

router.get("/", getAllWorkoutPlans);

router.get("/member/:memberId", getMemberWorkoutPlans);

router.get("/:id", getWorkoutPlanById);

router.put("/:id", updateWorkoutPlan);

router.delete("/:id", deleteWorkoutPlan);

module.exports = router;