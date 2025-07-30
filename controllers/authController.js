const { generateToken } = require('../config/passport');

const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000/login';
  res.redirect(`${baseUrl}?token=${token}&name=${req.user.name}&email=${req.user.email}`);
};

module.exports = { googleCallback };