const { generateToken } = require('../config/passport');

const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`http://localhost:3000/login?token=${token}&name=${req.user.name}&email=${req.user.email}`);
};

module.exports = { googleCallback };