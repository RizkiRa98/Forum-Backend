import jwt from "jsonwebtoken";

// Middleware verifikasi token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Jika user mengirim token makan split dan ambil token nya
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.email = decoded.email;
    req.userName = decoded.userName;
    next();
  });
};
