const Article = require('../models/article');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbiddenError');
const { ValidationError } = require('../errors/validationError');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .populate(['owner', 'likes'])
    .then((article) => res.status(200).send({ data: article }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { name, link } = req.body;
  Article.create({
    name, link, owner: req.user._id, likes: [],
  })
    .then((article) => res.status(200).send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Incorrect input'));
      }
      return next();
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).orFail(() => new NotFoundError('Article not found'))
    .then((article) => {
      if (article.owner.equals(req.user._id)) {
        Article.findByIdAndRemove(req.params.articleId)
          .then((item) => res.status(200).send({ data: item }))
          .catch(next);
      } else {
        throw new ForbiddenError('This article belongs to another user');
      }
    })
    .catch(next);
};

module.exports.likeArticle = (req, res, next) => Article.findByIdAndUpdate(
  req.params.articleId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Article not found'))
  .populate(['owner', 'likes'])
  .then((article) => res.status(200).send({ data: article }))
  .catch(next);

module.exports.dislikeArticle = (req, res, next) => Article.findByIdAndUpdate(
  req.params.articleId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Article not found'))
  .then((article) => res.status(200).send({ data: article }))
  .catch(next);
