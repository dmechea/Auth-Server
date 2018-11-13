// Instantiate Express
const express = require("express");
const app = express();
const { port, dbName } = require("./config");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const redis = require("redis");
// Import mongoose and instruct it to connect to our database.
const mongoose = require("mongoose");

const WhiteList = require("./middleware/whiteList");

const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

// Import and use body-parser

const authServerConnectTo = options => {
  const dbHost = options.dbHost ? options.dbHost : "mongodb://127.0.0.1/";
  const dbName = options.dbName ? options.dbName : "my_db";
  const mongooseSettings = options.mongooseSettings
    ? options.mongooseSettings
    : {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      };

  mongoose.connect(
    `${dbHost}${dbName}`,
    mongooseSettings
  );

  const whitelist = new WhiteList(redis);

  options.app.use(bodyParser.json());
  options.app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.locals.whitelist = whitelist;
    return next();
  });

  routes.forEach(route => {
    const service = express.Router();
    // Attach the routers own service instance
    service.use(route.service);
    console.log("Adding Route: ", route.endpoint);
    app.use(route.endpoint, service);
    app.use(errorHandler);
  });
};

const server = app.listen(port, () => {
  authServerConnectTo({ app });
  console.log(`Listening on port ${port}!`);
});

// server.close(() => {
//   console.log("closing ");
// });
