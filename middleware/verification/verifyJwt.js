const jwt = require("jsonwebtoken");
const boom = require("boom");
const { secret } = require("../../config").jwt;
const { lookUpToken } = require("../whiteList");

const unauthorized_message = "Sorry, you need to be logged in to do that..";

const verifyJwt = (req, res, next) => {
  const { authorization } = req.headers;

  // Didn't send a token or it's null
  if (!authorization) {
    return next(boom.unauthorized(unauthorized_message));
  }

  const token = authorization.split(" ")[1]; // get the token part and leave out 'Bearer'

  // Check the whitelist, If whitelist is good then you can verify
  lookUpToken(token)
    .then(value => {
      if (!value)
        return next(boom.unauthorized("Token is not on the whitelist"));

      // if it passes the whitelist then add to res.locals and continue
      res.locals.token = token; // save token to res.locals so we can access later

      // verify the jwt
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          // console.log(err);
          if (err.name === "TokenExpiredError") {
            return next(boom.unauthorized("Your session has expired")); // But maybe we should renew? Under what conditions?
          }
          return next(boom.unauthorized("Invalid Token"));
        }

        if (!decoded.email) {
          return next(boom.unauthorized("Invalid Token"));
        }

        res.locals.email = decoded.email;

        return next();
      });
    })
    .catch(error => {
      console.log(error);
      return next(boom.badImplementation(JSON.stringify(error)));
    });
};

module.exports = verifyJwt;
