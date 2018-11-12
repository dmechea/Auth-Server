// Instantiate Express
const express = require("express");
const app = express();
const { port, dbName } = require("./config");

const bodyParser = require("body-parser");
const morgan = require("morgan");

// Import mongoose and instruct it to connect to our database.
const mongoose = require("mongoose");
const mongoDB = `mongodb://127.0.0.1/${dbName}`;
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

// Import and use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

mongoose.connect(
  mongoDB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

routes.forEach(route => {
  const service = express.Router();
  // Attach the routers own service instance
  service.use(route.service);

  console.log("Adding Route: ", route.endpoint);

  app.use(route.endpoint, service);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
