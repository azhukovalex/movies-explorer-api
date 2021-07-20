const { celebrate, Joi } = require('celebrate');

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(20),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateId = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(120),
    director: Joi.string().required().min(2).max(100),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required().min(20).max(1500),
    image: Joi.string().regex(/^((http|https):\/\/(www\.)?([\w\W]{1,})\.([a-zA-z]{2,10})([\w\W]{1,})?(#)?)$/).required(),
    trailer: Joi.string().regex(/^((http|https):\/\/(www\.)?([\w\W]{1,})\.([a-zA-z]{2,10})([\w\W]{1,})?(#)?)$/).required(),
    nameRU: Joi.string().required().min(1).max(100),
    nameEN: Joi.string().required().min(1).max(100),
    movieId: Joi.number().required(),
    thumbnail: Joi.string().regex(/^((http|https):\/\/(www\.)?([\w\W]{1,})\.([a-zA-z]{2,10})([\w\W]{1,})?(#)?)$/).required(),
  }).unknown(true),
});

const validatedeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(20),
  }),
});

module.exports = {
  validateUser, // +
  validateUpdateProfile, // +
  validateId, // +
  validateMovie,
  validateLogin, // +
  validatedeleteMovie, // +
};
