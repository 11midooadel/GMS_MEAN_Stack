const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        days: {
            type: [String],
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        location: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Class", classSchema);