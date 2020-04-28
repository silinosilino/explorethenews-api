const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getArticles, createArticle, deleteArticle, likeArticle, dislikeArticle,
} = require('../controllers/articles');

articlesRouter.get('/articles', getArticles);

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).regex(/^https?:\/\/((((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5])))|((www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\/?))(:\d{2,5})?(\/([0-9a-zA-Z/._:-]+)?#?)?$/),
  }),
}), createArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().min(24).max(24),
  }),
}), deleteArticle);

articlesRouter.put('/articles/:articleId/likes', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().min(24).max(24),
  }),
}), likeArticle);

articlesRouter.delete('/articles/:articleId/likes', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().min(24).max(24),
  }),
}), dislikeArticle);

module.exports = articlesRouter;
