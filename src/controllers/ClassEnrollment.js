const ClassEnrollment = require("../models/ClassEnrollment");
const Class = require("../models/Classes");

// Enroll Member in Class (Member)
const enrollInClass = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Check if class is full
        const enrolledCount = await ClassEnrollment.countDocuments({ class: req.params.classId });
        if (enrolledCount >= classData.capacity) {
            return res.status(400).json({ message: "Class is full" });
        }
        // Check if member is already enrolled
        const existingEnrollment = await ClassEnrollment.findOne({ member: req.User.id, class: req.params.classId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "You are already enrolled in this class" });
        }

        const enrollment = await ClassEnrollment.create({ member: req.User.id, class: req.params.classId });
        res.status(201).json({ message: "Enrolled in class successfully", enrollment });
    } catch (error) {
        res.status(500).json({ message: "Error enrolling in class", error: error.message });
    }
};

// Leave Class (Member)
const leaveClass = async (req, res) => {
    try {
        const enrollment = await ClassEnrollment.findOneAndDelete({ member: req.User.id, class: req.params.classId });
        if (!enrollment) {
            return res.status(404).json({ message: "You are not enrolled in this class" });
        }
        res.status(200).json({ message: "You left the class successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error leaving class", error: error.message });
    }
};

// Get Member Classes (Member & admin)
const getMemberClasses = async (req, res) => { // What classes did THIS member join?
    try {
        const enrollments = await ClassEnrollment.find({ member: req.User.id }).populate({ path: "class", populate: { path: "trainer", select: "name email" } });
        res.status(200).json({ classes: enrollments });
    } catch (error) {
        res.status(500).json({
            message: "Error getting member classes",
            error: error.message
        });
    }
};

// Get Class Members(Trainer & member & admin) Who joined THIS class?
const getClassMembers = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Make sure the logged-in trainer owns this class
        if (classData.trainer.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "You are not the trainer of this class" });
        }

        const members = await ClassEnrollment.find({ class: req.params.classId }).populate("member", "name email");
        res.status(200).json({ members });
    } catch (error) {
        res.status(500).json({ message: "Error getting class members", error: error.message });
    }
};

module.exports = {
  enrollInClass,
  leaveClass,
  getMemberClasses,
  getClassMembers
};