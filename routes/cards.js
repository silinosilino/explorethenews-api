const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);

cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).regex(/^https?:\/\/((((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5])))|((www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\/?))(:\d{2,5})?(\/([0-9a-zA-Z/._:-]+)?#?)?$/),
  }),
}), createCard);

cardsRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(24).max(24),
  }),
}), deleteCard);

cardsRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(24).max(24),
  }),
}), likeCard);

cardsRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(24).max(24),
  }),
}), dislikeCard);

module.exports = cardsRouter;
