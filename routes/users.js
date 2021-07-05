const usersRouter = require('express').Router();
const {
  updateUser, getCurrentUser,
} = require('../controllers/users');

const {
  validateUpdateProfile,
  validateId,
} = require('../middlewares/validation');

usersRouter.get('/users/me', validateId, getCurrentUser);
usersRouter.patch('/users/me', validateUpdateProfile, updateUser);

module.exports = usersRouter;

/* # возвращает информацию о пользователе (email и имя)
GET /users/me

# обновляет информацию о пользователе (email и имя)
PATCH /users/me */
