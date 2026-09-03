const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const normalize = (role) => String(role || "").trim().toLowerCase().replace(/\s+/g, "_");
    const userRole = normalize(req.user.role);

    const hasPermission = allowedRoles.some(
      (role) => normalize(role) === userRole
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