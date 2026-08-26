const express = require("express");
const { enrollInClass, leaveClass,getMemberClasses,getClassMembers } = require("../controllers/ClassEnrollment");

const router = express.Router();

router.post("/:classId/enroll", enrollInClass);
router.get("/My-classes", getMemberClasses);
router.get("/:classId/members", getClassMembers);
router.delete("/:classId/leave", leaveClass);


module.exports = router;