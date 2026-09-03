const express = require("express");
const { enrollInClass, leaveClass, getMemberClasses, getClassMembers } = require("../controllers/ClassEnrollment");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const router = express.Router();

router.post("/:classId/enroll", auth, authorizeRoles("member"), enrollInClass);
router.get("/my-classes", auth, authorizeRoles("member"), getMemberClasses);
router.get("/:classId/members", auth, getClassMembers);
router.delete("/:classId/leave", auth, authorizeRoles("member"), leaveClass);


module.exports = router;