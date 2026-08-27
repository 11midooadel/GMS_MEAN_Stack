const express = require("express");
const { createClass, getAllClasses, getTrainerClasses, getClassById, updateClass, deleteClass } = require("../controllers/classes");

const router = express.Router();

router.post("/create", createClass);
router.get("/getAllClasses", getAllClasses);
router.get("/My-classes", getTrainerClasses);
router.get("/:id", getClassById);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

module.exports = router;