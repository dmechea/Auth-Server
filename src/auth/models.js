const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(function(rawString) {
  this.passwordHash = bcrypt.hashSync(rawString, 10);
});

const User = mongoose.model("User", UserSchema);
