/* eslint-disable consistent-return */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  res.status(500).json({ message: err.message });
};

module.exports = errorHandler;
