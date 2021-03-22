const moviesRouter = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const {
  validateMovie,
  validatedeleteMovie,
} = require('../middlewares/validation');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validateMovie, createMovie);
moviesRouter.delete('/movies/:id', validatedeleteMovie, deleteMovie); // id

module.exports = moviesRouter;

/*
# возвращает все сохранённые пользователем фильмы
GET /movies

# создаёт фильм с переданными в теле
# country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail
POST /movies

# удаляет сохранённый фильм по _id
DELETE /movies/movieId */
