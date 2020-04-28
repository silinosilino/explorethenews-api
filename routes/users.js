const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, doesUserExist, updateAvatar, updateProfile,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(24).max(24),
  }),
}), doesUserExist);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).regex(/^https?:\/\/((((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5])))|((www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\/?))(:\d{2,5})?(\/([0-9a-zA-Z/._:-]+)?#?)?$/),
  }),
}), updateAvatar);

module.exports = usersRouter;
