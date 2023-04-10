const User = require('../models/user');

const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  CREATED,
} = require('../constants/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      const error = new Error('User not found');
      error.status = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'User not found' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid ID format' });
        return;
      }
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    });
};

const createUser = (req, res) => {
  const { name, avatar, about } = req.body;

  User.create({ name, avatar, about })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Invalid data passed for creating a user' });
      } else {
        res.status(DEFAULT).send({ message: 'We have encountered an error' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid ID format' });
        return;
      }
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message);
        res
          .status(BAD_REQUEST)
          .send({ message: `Invalid user data: ${message}` });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'User not found' });
        return;
      }
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid ID format' });
        return;
      }
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message);
        res
          .status(BAD_REQUEST)
          .send({ message: `Invalid user data: ${message}` });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'User not found' });
        return;
      }
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
