const mongoose = require("mongoose");

const classEnrollmentSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    }
);
classEnrollmentSchema.index(
    { member: 1, class: 1 },
    { unique: true }
);
module.exports = mongoose.model("ClassEnrollment", classEnrollmentSchema);