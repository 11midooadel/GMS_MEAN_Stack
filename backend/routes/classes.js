const express = require("express");
const { createClass, getAllClasses, getTrainerClasses, getClassById, updateClass, deleteClass } = require("../controllers/classes");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/create", auth, authorizeRoles("trainer"), createClass);
router.get("/getAllClasses", auth, getAllClasses);
router.get("/My-classes", auth, authorizeRoles("trainer"), getTrainerClasses);
router.get("/:id", auth, getClassById);
router.put("/:id", auth, updateClass);
router.delete("/:id", auth, deleteClass);

module.exports = router;