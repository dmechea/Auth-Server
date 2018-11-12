const express = require("express");
const login = require("./routes/login");
const register = require("./routes/register");
const logout = require("./routes/logout");

require("./models");
const verifyJwt = require("../../middleware/verification/verifyJwt");

const authService = express.Router();

authService.post("/login", login);
authService.delete("/logout", verifyJwt, logout);
authService.post("/register", register);

module.exports = authService;
