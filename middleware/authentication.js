const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const authMiddleWare = (req, res, next) => {
  //check for token if a token is present decode that token
  //call next if token is right
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Token is not provided");
  }
  const token = authorization.split(" ")[1];
  console.log(process.env.JwtSecret);
  console.log("the token is:", token);
  try {
    const decodedToken = jwt.verify(token, process.env.JwtSecret);

    const { name, userId } = decodedToken;
    req.user = { name, userId };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};
module.exports = authMiddleWare;
