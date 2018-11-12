const bcrypt = require("bcrypt");

const compareHash = (actualPasswordHash, enteredPassword) => {
  return bcrypt.compareSync(enteredPassword, actualPasswordHash);
};

module.exports = {
  compareHash
};
