const boom = require("boom");
const mongoose = require("mongoose");
const isString = require("lodash/isString");

const isValidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  // Check for empty fields
  if (!email || !password || !confirmPassword)
    return next(boom.badData("Missing email or password"));

  // Check for incorrect types
  if (!isString(email) || !isString(password) || !isString(confirmPassword)) {
    return next(boom.badData("Email or password is of incorrect type"));
  }

  // Check to make sure email is valid
  if (!isValidEmail(email)) {
    return next(boom.badData("Email is invalid"));
  }

  if (password !== confirmPassword) {
    return next(boom.badData("Passwords do not match"));
  }

  mongoose
    .model("User")
    .create({ email, password })
    .then(user => {
      res.status(201).send({ success: true });
    })
    .catch(err => {
      const { message, name } = err;
      if (err.name === "ValidationError")
        return next(boom.badData("Sorry that username is already taken"));

      // If theres a code thats not duplicate key then throw internal service error
      return next(
        boom.badImplementation(
          JSON.stringify({
            location: __filename,
            errmsg,
            code
          })
        )
      );
    });
};
