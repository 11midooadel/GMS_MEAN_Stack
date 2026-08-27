const Attendance = require("../models/attendance");

// Check In
const checkIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const activeAttendance = await Attendance.findOne({ user: userId, checkOut: null });
        if (activeAttendance) {
            return res.status(400).json({ message: "You are already checked in" });
        }
        
        const attendance = await Attendance.create({ user: userId });

        res.status(201).json({ message: "Checked in successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: "Error checking in", error: error.message });
    }
};

// Check Out
const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await Attendance.findOne({ user: userId, checkOut: null });

        if (!attendance) {
            return res.status(404).json({ message: "You are not currently checked in" });
        }
        attendance.checkOut = new Date();
        await attendance.save();

        res.status(200).json({ message: "Checked out successfully", attendance });

    } catch (error) {
        res.status(500).json({ message: "Error checking out", error: error.message });
    }
};

// Get My Attendance
const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await Attendance.find({ user: userId }).sort({ checkIn: -1 });
        res.status(200).json({ attendance });
    } catch (error) {
        res.status(500).json({ message: "Error getting attendance", error: error.message });
    }
};

// Get Attendance By User
const getAttendanceByUser = async (req, res) => {
    try {
        const attendance = await Attendance.find({user: req.params.userId}).sort({ checkIn: -1 });
        res.status(200).json({attendance});
    } catch (error) {
        res.status(500).json({message: "Error getting user attendance",error: error.message});
    }
};

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getAttendanceByUser
};