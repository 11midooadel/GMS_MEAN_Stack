const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        checkIn: {
            type: Date,
            required: true,
            default: Date.now
        },

        checkOut: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Attendance", attendanceSchema);