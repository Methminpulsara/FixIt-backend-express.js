module.exports = ([role]) => {
  return (req, res, next) => {
    if (!req.user || req.user.type !== role) {
      return res
        .status(403)
        .json({ message: `Only ${role} can asscess this resorses` });
    }
    next();
  };
};
