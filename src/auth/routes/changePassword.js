const boom = require("boom");
const mongoose = require("mongoose");
const isString = require("lodash/isString");

const changePassword = (req, res, next) => {
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

  res.send(null);
};

module.exports = changePassword;
