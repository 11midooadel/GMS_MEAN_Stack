const express = require("express");
const { enrollInClass, leaveClass, getMemberClasses, getClassMembers } = require("../controllers/ClassEnrollment");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/:classId/enroll", auth, authorizeRoles("Member"), enrollInClass);
router.get("/my-classes", auth, authorizeRoles("Member"), getMemberClasses);
router.get("/:classId/members", auth, getClassMembers);
router.delete("/:classId/leave", auth, authorizeRoles("Member"), leaveClass);


module.exports = router;