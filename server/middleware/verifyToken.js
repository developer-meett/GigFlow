const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adds { id: "..." } to req
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is not valid!" });
  }
};