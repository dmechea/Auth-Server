const express = require("express");
const login = require("./login");
const register = require("./register");
const logout = require("./logout");

require("./models");
const verifyJwt = require("../../middleware/verification/verifyJwt");

const authService = express.Router();

authService.post("/login", login);
authService.delete("/logout", verifyJwt, logout);
authService.post("/register", register);

module.exports = authService;
