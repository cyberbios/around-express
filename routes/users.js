const router = require('express').Router();
const limiter = require('../constants/rateLimit');

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', limiter, getUsers);
router.get('/users/:id', limiter, getUserById);
router.post('/users', limiter, createUser);
router.patch('/users/me', limiter, updateUser);
router.patch('/users/me/avatar', limiter, updateUserAvatar);

module.exports = router;
