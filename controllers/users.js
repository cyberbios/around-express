const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => {
      res.status(500).send({ message: 'We have encountered an error' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(err.message);
      } else {
        res.status(500).send(err.message);
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar, about } = req.body;

  User.create({ name, avatar, about })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = `${Object.values(
          err.errors.map((error) => error.message)
        )}`;
        res
          .status(400)
          .send({ message: 'Invalid data passed for creating a user' });
      } else {
        res.status(500).send({ message: err.message });
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
        return res.status(400).send({ message: 'Invalid ID format' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message);
        return res
          .status(400)
          .send({ message: `Invalid user data: ${message}` });
      } else if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(500).send({ message: 'We have encountered an error' });
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
        return res.status(400).send({ message: 'Invalid ID format' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message);
        return res
          .status(400)
          .send({ message: `Invalid user data: ${message}` });
      } else if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(500).send({ message: 'We have encountered an error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
