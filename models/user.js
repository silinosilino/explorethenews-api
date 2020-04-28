const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const checkValidity = require('validator');
const { UnauthorizedError } = require('../errors/unauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return checkValidity.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/((((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5])))|((www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\/?))(:\d{2,5})?(\/([0-9a-zA-Z/._:-]+)?#?)?$/.test(v);
      },
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCreds(email, password) {
  return this.findOne({ email }).select('+password').orFail(() => new UnauthorizedError('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password)

      .then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
        }
        return user;
      }));
};

userSchema.methods.omitPrivate = function omitPrivate() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
