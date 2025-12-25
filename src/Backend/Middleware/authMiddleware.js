// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

async function requireAuth(req, res, next) {
  // 1) Check Access Token header
  const auth = req.headers.authorization?.split(' ');
  if (!auth || auth[0] !== 'Bearer') return res.sendStatus(401);
  const token = auth[1];

  // 2) Verify
  let payload;
  try {
    payload = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
  } catch (e) {
    return res.sendStatus(401);
  }

  // 3) Attach user
  const user = await User.findOne({ email: payload.email });
  if (!user) return res.sendStatus(401);
  req.user = user;
  next();
}

module.exports = requireAuth;
