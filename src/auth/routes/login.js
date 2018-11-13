const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const boom = require("boom");
const isString = require("lodash/isString");
const { secret, expiresIn } = require("../../../config").jwt;
// const { addToken } = require("../../../middleware/whiteList");
const { compareHash } = require("../tools");

const unauthorized = "The email or password you have entered is invalid.";

module.exports = (req, res, next) => {
  const { email, password } = req.body;
  const { whitelist } = res.locals;

  if (!email || !password)
    return next(boom.badData("Missing email or password"));

  // Check for incorrect types
  if (!isString(email) || !isString(password)) {
    return next(boom.badData("Email or password is of incorrect type"));
  }

  mongoose
    .model("User")
    .findOne({ email })
    .then(response => {
      if (!response) return next(boom.unauthorized(unauthorized));

      const validPassword = compareHash(response.passwordHash, password);

      if (!validPassword) return next(boom.unauthorized(unauthorized));

      const token = jwt.sign({ email }, secret, { expiresIn });

      // Just adding a timestamp on creation for now. Not sure what to implement yet?
      // I figured timestamp could be used later to disqualify / garbage collect tokens.
      whitelist
        .addToken(token, +new Date())
        .then(response => {
          return res.status(201).send({ success: true, token });
        })
        .catch(error => {
          return boom.badImplementation(JSON.stringify(error));
        });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};
