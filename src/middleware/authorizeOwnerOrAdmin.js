const authorizeOwnerOrAdmin = (req, res, next) => {
  if (
    req.user.role === "Admin" || req.user.role === "Super Admin" ||
    req.user.userId.toString() === req.params.id
  ) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};

module.exports = authorizeOwnerOrAdmin;