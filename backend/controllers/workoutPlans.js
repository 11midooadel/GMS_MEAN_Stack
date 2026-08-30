const WorkoutPlan = require("../models/workoutPlans");
require("../models/users");

// Create Workout Plan
const createWorkoutPlan = async (req, res) => {
    try {
        const { memberId, name, description, days } = req.body;

        if (!memberId || !name || !days) {
            return res.status(400).json({
                message: "memberId, name and days are required"
            });
        }

        const workoutPlan = await WorkoutPlan.create({
            memberId,
            name,
            description,
            days
        });

        res.status(201).json({
            message: "Workout plan created successfully",
            data: workoutPlan
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// Get All Workout Plans
const getAllWorkoutPlans = async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find()
            .populate("memberId", "userName email");

        res.status(200).json({
            data: workoutPlans
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// Get Workout Plan by ID
const getWorkoutPlanById = async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findById(req.params.id)
            .populate("memberId", "userName email");

        if (!workoutPlan) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        res.status(200).json({
            data: workoutPlan
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// Get Workout Plans by Member
const getMemberWorkoutPlans = async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find({
            memberId: req.params.memberId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            data: workoutPlans
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// Update Workout Plan
const updateWorkoutPlan = async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!workoutPlan) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        res.status(200).json({
            message: "Workout plan updated successfully",
            data: workoutPlan
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// Delete Workout Plan
const deleteWorkoutPlan = async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findByIdAndDelete(req.params.id);

        if (!workoutPlan) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        res.status(200).json({
            message: "Workout plan deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


module.exports = {
    createWorkoutPlan,
    getAllWorkoutPlans,
    getWorkoutPlanById,
    getMemberWorkoutPlans,
    updateWorkoutPlan,
    deleteWorkoutPlan
};