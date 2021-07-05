require('dotenv').config();

const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const usersRoutes = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const ServerError = require('./errors/serv-err');
const { validateUser, validateLogin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/MovieDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(
  cors(),
);

app.use(helmet());
app.use(bodyParser.json()); // устарел?

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);
app.use(auth);
app.use('/', usersRoutes);
app.use('/', moviesRouter);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res) => {
  if (err.status) {
    res.status(err.status).send(err.message);
    return;
  }
  throw new ServerError({ message: `На сервере произошла ошибка: ${err.message}` });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
