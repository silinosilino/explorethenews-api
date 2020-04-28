const Card = require('../models/card');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbiddenError');
const { ValidationError } = require('../errors/validationError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id, likes: [],
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Incorrect input'));
      }
      return next();
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(() => new NotFoundError('Card not found'))
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((item) => res.status(200).send({ data: item }))
          .catch(next);
      } else {
        throw new ForbiddenError('This card belongs to another user');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Card not found'))
  .populate(['owner', 'likes'])
  .then((card) => res.status(200).send({ data: card }))
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Card not found'))
  .then((card) => res.status(200).send({ data: card }))
  .catch(next);
