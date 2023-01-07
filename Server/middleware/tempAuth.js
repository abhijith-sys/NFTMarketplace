const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) next();
  try {
    const { userId } = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    req.user = userId;
    next();
  } catch (error) {
    next();
  }
};

module.exports = authenticateToken;