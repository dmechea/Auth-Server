const boom = require("boom");

const logout = (req, res, next) => {
  // Delete the incoming token from redis whitelist
  const { token, whitelist } = res.locals;

  whitelist
    .removeToken(token)
    .then(() => {
      res.send({ success: true });
    })
    .catch(error => {
      return boom.badImplementation(JSON.stringify(error));
    });
};

module.exports = logout;
