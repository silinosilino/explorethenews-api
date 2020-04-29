const Article = require('../models/article');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbiddenError');
const { ValidationError } = require('../errors/validationError');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.status(200)
      .send({ data: articles.map((article) => article.omitPrivate()) }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.status(200).send({ data: article.omitPrivate() }))
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
          .then((item) => res.status(200).send({ data: item.omitPrivate() }))
          .catch(next);
      } else {
        throw new ForbiddenError('This article belongs to another user');
      }
    })
    .catch(next);
};
