// 1. importing the jwt library to verify the token
const jwt = require("jsonwebtoken");
// 2. exporting a middleware function that will be used to protect routes
module.exports = function (req, res, next) {

// 3. getting the token from the request header
try{
    let token = req.header("Authorization") || "";
// 4. if there is no token, stop the request and return a 401 status code with a message
    if (!token) {
      return res.status(401).json({ msg: "No token, access denied" });
    }
    // Remove "Bearer "
// 5. if the token starts with "Bearer", remove it to get the actual token
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
// 6. verifying the token using the secret key and getting the decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
// 7. saving the user id from the decoded token to the request object for use in the next middleware or route handler
    req.user = decoded.id; 
    next();
  } catch (err) {
// 8. if anything fails like wrong token or expired token, catch the error and return a 401 status code with a message
    return res.status(401).json({ msg: "Token is not valid" });
  }
};