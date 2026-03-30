module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const roles = Array.isArray(role) ? role : [role];

    if (!roles.includes(req.user.type)) {
      return res.status(403).json({
        message: `Only ${roles.join(" or ")} can access this resource`
      });
    }

    next();
  };
};