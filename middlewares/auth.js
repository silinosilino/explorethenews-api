const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  let token = null;


  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '');
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
