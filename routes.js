const authService = require("./src/auth");
const testService = require("./src/testRoutes");

const routes = [
  {
    endpoint: "/auth",
    service: authService
  }
];

const devRoutes = [
  {
    endpoint: "/test",
    service: testService
  }
];

module.exports =
  process.env.NODE_ENV === "production" ? routes : [...routes, ...devRoutes];
