const jwt = require("jsonwebtoken");
const secrate = process.env.JWT_SECRATE || "subham";
const fetchuser = (req, res, next) => {
  // get user from the jwt token add id to the req obj
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authonticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, secrate);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(400).send({ error: "please authonticate using a valid token" });
  }
};

module.exports = fetchuser;
