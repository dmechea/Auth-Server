const boom = require("boom");
const mongoose = require("mongoose");
const isString = require("lodash/isString");
const { compareHash } = require("../tools");
const bcrypt = require("bcrypt");

const changePassword = (req, res, next) => {
  const { email, token } = res.locals;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // Check for empty fields
  if (!currentPassword || !newPassword || !confirmNewPassword)
    return next(boom.badData("missing password field"));

  // Check for incorrect types
  if (
    !isString(currentPassword) ||
    !isString(newPassword) ||
    !isString(confirmNewPassword)
  ) {
    return next(boom.badData("A password field is of an incorrect type"));
  }

  if (newPassword !== confirmNewPassword) {
    return next(boom.badData("Passwords do not match"));
  }

  mongoose
    .model("User")
    .findOne({ email })
    .then(response => {
      if (!response)
        return boom.badImplementation(
          "Can't find email even though we have it saved in locals"
        );

      const validPassword = compareHash(response.passwordHash, currentPassword);

      if (!validPassword)
        return next(boom.badData("Incorrect current password entered."));

      const passwordHash = bcrypt.hashSync(newPassword, 10);

      mongoose
        .model("User")
        .findOneAndUpdate({ email }, { $set: { passwordHash } }, { new: true })
        .then(response => {
          res.status(200).send({ success: true });
        })
        .catch(error => {
          return boom.badImplementation(JSON.stringify(error));
        });
    })
    .catch(err => {
      return boom.badImplementation(JSON.stringify(err));
    });
};

module.exports = changePassword;
