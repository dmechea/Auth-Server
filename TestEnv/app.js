//app.js
const express = require("express");
const authApp = require("../index.js");
const app = express();

module.exports = authApp({ app });
