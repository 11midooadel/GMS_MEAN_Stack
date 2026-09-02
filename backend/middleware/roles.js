const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const userRole = String(req.user.role || "").toLowerCase();

    const hasPermission = allowedRoles.some(
      (role) => role.trim().toLowerCase() === userRole.trim().toLowerCase()
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "Access denied. You do not have permission",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;