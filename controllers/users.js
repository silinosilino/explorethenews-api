const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error');
const { ConflictError } = require('../errors/conflictError');
const { ValidationError } = require('../errors/validationError');

const { JWT_SECRET } = require('../config.js');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id).orFail(() => new NotFoundError('User not found'))
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({ data: user.omitPrivate() }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Incorrect input'));
      }
      if (err.message.includes('duplicate key')) {
        return next(new ConflictError('User with this email already exists'));
      }
      return next();
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};
