const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-req-err');
const ServerError = require('../errors/serv-err');
// const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      id: user._id,
    }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, 8)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((data) => res.status(200).send({ email: data.email, name: user.name }));
    })
    .catch(next);
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError({ message: `Ошибка при валидации: ${err}` });
      } else {
        throw new ServerError({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res
        .send({ token: token.toString() });
    })
    .catch(next);
};

module.exports = {
  createUser, updateUser, login, getCurrentUser,
};
