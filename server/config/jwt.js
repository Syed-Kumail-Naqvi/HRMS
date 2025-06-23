const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

module.exports = {
  generateToken,
  generateResetToken
};