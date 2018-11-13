// Instantiate Express
const express = require("express");
const app = express();
const { port, dbName } = require("./config");

const bodyParser = require("body-parser");
const morgan = require("morgan");

// Import mongoose and instruct it to connect to our database.
const mongoose = require("mongoose");

const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

// app.use(authServer())

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

  options.app.use(bodyParser.json());
  options.app.use(bodyParser.urlencoded({ extended: true }));

  routes.forEach(route => {
    const service = express.Router();
    // Attach the routers own service instance
    service.use(route.service);
    console.log("Adding Route: ", route.endpoint);
    app.use(route.endpoint, service);
    app.use(errorHandler);
  });
};

app.listen(port, () => {
  authServerConnectTo({ app });
  console.log(`Listening on port ${port}!`);
});
