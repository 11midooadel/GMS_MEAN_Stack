const WorkoutPlan = require("../models/workoutPlans");
const User = require("../models/users");

const createWorkoutPlan = async (req, res) => {
    try {
        const { name, description, days } = req.body;
        const memberId = req.user.role === "Member" ? req.user.userId : req.body.memberId;

        if (!memberId || !name || !days) {
            return res.status(400).json({
                message: "memberId, name and days are required"
            });
        }

        if (req.user.role === "Trainer") {
            const member = await User.findById(memberId).select("assignedTrainer");
            if (!member || !member.assignedTrainer || member.assignedTrainer.toString() !== req.user.userId.toString()) {
                return res.status(403).json({ message: "You are not allowed to create a plan for this member" });
            }
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

const getAllWorkoutPlans = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === "Trainer") {
            const members = await User.find({ assignedTrainer: req.user.userId }).select("_id");
            const memberIds = members.map(m => m._id);
            filter = { memberId: { $in: memberIds } };
        }
        const workoutPlans = await WorkoutPlan.find(filter)
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
            .populate("memberId", "userName email assignedTrainer");

        if (!workoutPlan) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        if (req.user.role === "Member" && workoutPlan.memberId._id.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to view this workout plan" });
        }
        if (req.user.role === "Trainer" && (!workoutPlan.memberId.assignedTrainer || workoutPlan.memberId.assignedTrainer.toString() !== req.user.userId.toString())) {
            return res.status(403).json({ message: "You are not allowed to view this workout plan" });
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
        if (req.user.role === "Member" && req.params.memberId !== req.user.userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to view these workout plans" });
        }
        if (req.user.role === "Trainer") {
            const member = await User.findById(req.params.memberId).select("assignedTrainer");
            if (!member || !member.assignedTrainer || member.assignedTrainer.toString() !== req.user.userId.toString()) {
                return res.status(403).json({ message: "You are not allowed to view these workout plans" });
            }
        }
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
        const existing = await WorkoutPlan.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        if (req.user.role === "Member" && existing.memberId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to modify this workout plan" });
        }
        if (req.user.role === "Trainer") {
            const member = await User.findById(existing.memberId).select("assignedTrainer");
            if (!member || !member.assignedTrainer || member.assignedTrainer.toString() !== req.user.userId.toString()) {
                return res.status(403).json({ message: "You are not allowed to modify this workout plan" });
            }
        }
        if (req.user.role === "Member") delete req.body.memberId;

        const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

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
        const workoutPlan = await WorkoutPlan.findById(req.params.id);

        if (!workoutPlan) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        if (req.user.role === "Member" && workoutPlan.memberId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to delete this workout plan" });
        }
        if (req.user.role === "Trainer") {
            const member = await User.findById(workoutPlan.memberId).select("assignedTrainer");
            if (!member || !member.assignedTrainer || member.assignedTrainer.toString() !== req.user.userId.toString()) {
                return res.status(403).json({ message: "You are not allowed to delete this workout plan" });
            }
        }

        await WorkoutPlan.findByIdAndDelete(req.params.id);

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