const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-req-err');
const ServerError = require('../errors/serv-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch((err) => res.status(500).send(err));

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movieData) => {
      res.status(200).send(movieData);
    })
    .catch((err) => {
      if (err) {
        throw new BadRequestError({ message: `Введены некорректные данные: ${err}` });
      } else {
        throw new ServerError({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  console.log(req.params.id);
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      } else {
        Movie.findByIdAndDelete(req.params.id)
          .then(() => { // movie
            res.status(200).send(movie);
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
