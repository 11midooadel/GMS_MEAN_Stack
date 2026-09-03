const express = require('express');
const {createHealthRecord, getMemberHealthHistory, updateHealthRecord, deleteHealthRecord} = require('../controllers/healthRecord');
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/create", auth, authorizeRoles("admin", "super_admin", "member"), createHealthRecord);
router.get("/member/:memberId/history", auth, getMemberHealthHistory);
router.put("/:id", auth, authorizeRoles("admin", "super_admin", "member"), updateHealthRecord);
router.delete("/:id", auth, authorizeRoles("admin", "super_admin", "member"), deleteHealthRecord);

module.exports = router;