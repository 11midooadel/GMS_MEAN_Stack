console.log("ROLES.JS LOADED");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const userRole = String(req.user.role || "").toLowerCase();

    console.log("USER ROLE:", req.user.role);
    console.log("ALLOWED ROLES:", allowedRoles);

    const hasPermission = allowedRoles.some(
      (role) => role.trim().toLowerCase() === userRole.trim().toLowerCase()
    );

    console.log("HAS PERMISSION:", hasPermission);

    if (!hasPermission) {
      return res.status(403).json({
        message: "Access denied. You do not have permission",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;