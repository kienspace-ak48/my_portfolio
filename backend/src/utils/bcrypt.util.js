const bcrypt = require("bcrypt");

const SALT = 10;

async function hash(password) {
  return bcrypt.hash(password, SALT);
}

async function compare(password, hashPassword) {
  return bcrypt.compare(password, hashPassword);
}

module.exports = {
  hash,
  compare,
};
