const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        days: [
            {
                day: {
                    type: String,
                    enum: [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                    ],
                    required: true
                },

                exercises: [
                    {
                        name: {
                            type: String,
                            required: true,
                            trim: true
                        },

                        sets: {
                            type: Number,
                            required: true,
                            min: 1
                        },

                        reps: {
                            type: Number,
                            required: true,
                            min: 1
                        }
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);