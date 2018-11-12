const { removeToken } = require("../../../middleware/whiteList");
const boom = require("boom");

const logout = (req, res, next) => {
  // Delete the incoming token from redis whitelist
  const { token } = res.locals;

  removeToken(token)
    .then(() => {
      res.send({ success: true });
    })
    .catch(error => {
      return boom.badImplementation(JSON.stringify(error));
    });
};

module.exports = logout;
