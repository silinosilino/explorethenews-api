const usersRouter = require('express').Router();

const { getUserInfo } = require('../controllers/users');

usersRouter.get('/users/me', getUserInfo);

module.exports = usersRouter;
