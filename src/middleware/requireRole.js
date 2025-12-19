module.exports = (role) => {
  return (req, res, next) => {
    // 1. User කෙනෙක් Login වී ඇත්දැයි පරීක්ෂා කිරීම
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 2. ලබා දී ඇති role එක String එකක් නම් එය Array එකක් බවට හරවා ගැනීම (පහසුව සඳහා)
    const roles = Array.isArray(role) ? role : [role];

    // 3. Login වී සිටින User ගේ type එක, අවසර දී ඇති roles අතර තිබේදැයි පරීක්ෂා කිරීම
    if (!roles.includes(req.user.type)) {
      return res.status(403).json({
        message: `Only ${roles.join(" or ")} can access this resource`
      });
    }

    // 4. Role එක ගැලපේ නම් ඊළඟ පියවරට ඉඩ දීම
    next();
  };
};