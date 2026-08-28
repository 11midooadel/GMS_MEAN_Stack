const express = require('express');
const {
	createHealthRecord, getMemberHealthHistory, updateHealthRecord, deleteHealthRecord
} = require('../controllers/healthRecord');

const router = express.Router();

// REMINDER: We should add User (Member)/Admin Auth middleware here
router.post("/create", createHealthRecord);

router.get("/member/:memberId/history", getMemberHealthHistory); // Returns the full history array for charts/graphs

router.put("/:id", updateHealthRecord); // Fix data entry mistakes

router.delete("/:id", deleteHealthRecord);

module.exports = router;