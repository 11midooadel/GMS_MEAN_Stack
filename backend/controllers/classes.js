    const Class = require("../models/Classes");
    const ClassEnrollment = require("../models/ClassEnrollment");

    const createClass = async (req, res) => {
        try {
            const { name, description, days, startTime, duration, capacity, location, trainer } = req.body;

            // A Trainer always creates their own class; Admin/Super Admin must pick who teaches it.
            const trainerId = req.user.role === "Trainer" ? req.user.userId : trainer;
            if (!trainerId) {
                return res.status(400).json({ message: "A trainer must be selected for this class" });
            }

            const newClass = await Class.create({ name, description, trainer: trainerId, days, startTime, duration, capacity, location });
            res.status(201).json({ message: "Class created successfully", class: newClass });
        } catch (error) {
            res.status(500).json({ message: "Error creating class", error: error.message });
        }
    };

    const getAllClasses = async (req, res) => {
        try {
            const classes = await Class.find().populate("trainer", "name email");
            res.status(200).json({ classes });
        } catch (error) {
            res.status(500).json({ message: "Error getting classes", error: error.message });
        }
    };

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

    const updateClass = async (req, res) => {
        try {
            const classData = await Class.findById(req.params.id);
            if (!classData) {
                return res.status(404).json({ message: "Class not found" });
            }

            if (req.user.role !== "Admin" && req.user.role !== "Super Admin" && classData.trainer.toString() !== req.user.userId) {
                return res.status(403).json({ message: "You are not allowed to update this class" });
            }

            const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body,
                {
                    new: true, // After Update return new version
                    runValidators: true // check the schema rules before Updateing
                }
            );

            res.status(200).json({ message: "Class updated successfully", class: updatedClass });
        } catch (error) {
            res.status(500).json({ message: "Error updating class", error: error.message });
        }
    };

    const deleteClass = async (req, res) => {
        try {
            const classData = await Class.findById(req.params.id);
            if (!classData) {
                return res.status(404).json({ message: "Class not found" });
            }
            
            if (req.user.role !== "Admin" && req.user.role !== "Super Admin" && classData.trainer.toString() !== req.user.userId) {
                return res.status(403).json({ message: "You are not allowed to delete this class" });
            }

            await Class.findByIdAndDelete(req.params.id);
            // Delete all enrollments related to this class
            await ClassEnrollment.deleteMany({ class: req.params.id });
            res.status(200).json({ message: "Class deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting class", error: error.message });
        }
    };

    // Get Trainer Classes (Trainer) // What classes does THIS trainer teach?
    const getTrainerClasses = async (req, res) => {
        try {
            const classes = await Class.find({ trainer: req.user.userId });
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