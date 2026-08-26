const Class = require("../models/Classes");
const ClassEnrollment = require("../models/ClassEnrollment");

// Create Class (Trainer)
const createClass = async (req, res) => {
    try {
        const { name, description, days, startTime, duration, capacity, location } = req.body;

        const newClass = await Class.create({ name, description, trainer: req.user.id, days, startTime, duration, capacity, location });
        res.status(201).json({ message: "Class created successfully", class: newClass });
    } catch (error) {
        res.status(500).json({ message: "Error creating class", error: error.message });
    }
};

// Get All Classes (Member & Trainer)
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate("trainer", "name email");
        res.status(200).json({ classes });
    } catch (error) {
        res.status(500).json({ message: "Error getting classes", error: error.message });
    }
};

// Get Class By ID (Member & Trainer)
const getClassById = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id).populate("trainer", "name email");

        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ class: classData });
    } catch (error) {
        res.status(500).json({ message: "Error getting class", error: error.message });
    }
};

// Update Class (Trainer)
const updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true, // After Update return new version
                runValidators: true // check the schema rules before Updateing
            }
        );

        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ message: "Class updated successfully", class: updatedClass });
    } catch (error) {
        res.status(500).json({ message: "Error updating class", error: error.message });
    }
};

// Delete Class (Trainer Only)
const deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" })
        }

        // Delete all enrollments related to this class
        await ClassEnrollment.deleteMany({ class: req.params.id });
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting class", error: error.message });
    }
};

// Get Trainer Classes (Trainer & admin) // What classes does THIS trainer teach?
const getTrainerClasses = async (req, res) => {
    try {
        const classes = await Class.find({ trainer: req.user.id });
        res.status(200).json({ classes });
    } catch (error) {
        res.status(500).json({ message: "Error getting trainer classes", error: error.message });
    }
};


module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  getTrainerClasses,
};