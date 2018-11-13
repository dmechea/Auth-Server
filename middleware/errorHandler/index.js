const boom = require("boom");

module.exports = (err, req, res, next) => {
  const { whitelist, token } = res.locals;

  if (err.isServer) {
    console.log(err);
  }

  const statusCode = err.output.payload.statusCode;

  /*
  We will only have a token in res.locals if it has passed the whitelist.
  If We have a token and we are still unauthorized then the token shouldn't
  be on the whitelist. So remove it.
  */

  if (token && parseInt(statusCode) === 401) {
    whitelist
      .removeToken(token)
      .then(() => {
        res.status(statusCode).send(err.output.payload);
      })
      .catch(error => {
        console.log(error); // Should log that this failed
        boom.badImplementation(JSON.stringify(error)); // Upgrade to server issue
      });
  } else {
    res.status(statusCode).send(err.output.payload);
  }
};
