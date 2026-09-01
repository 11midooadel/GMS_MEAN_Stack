const express = require('express');
const {createHealthRecord, getMemberHealthHistory, updateHealthRecord, deleteHealthRecord} = require('../controllers/healthRecord');
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/create", auth, authorizeRoles("Admin", "Super Admin", "Member"), createHealthRecord);
router.get("/member/:memberId/history", auth, getMemberHealthHistory);
router.put("/:id", auth, authorizeRoles("Admin", "Super Admin", "Member"), updateHealthRecord);
router.delete("/:id", auth, authorizeRoles("Admin", "Super Admin", "Member"), deleteHealthRecord);

module.exports = router;