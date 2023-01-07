const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (token === "null" || token === null) {
      return res.status(401).send({ message: "token needed" });
    }
    const { userId } = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    req.user = userId;
    next();
  } catch (error) {
    res.status(403).send(error);
  }
};

module.exports = authenticateToken;
