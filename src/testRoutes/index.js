const express = require("express");
const verifyJwt = require("../../middleware/verification/verifyJwt");

const testService = express.Router();

testService.get("/verify_jwt", verifyJwt, (req, res) => {
  res.send("access_granted");
});

module.exports = testService;
