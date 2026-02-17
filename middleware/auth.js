import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json("No token");

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin only");
  next();
};
