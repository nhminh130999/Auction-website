const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // vo header chon header Authorization, body: Bearer token
    const decoded = jwt.verify(token, "secret");
    console.log(decoded);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: error,
      message: "Authentication failed",
    });
  }

};

