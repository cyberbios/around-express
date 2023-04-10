const router = require('express').Router();
const limiter = require('../constants/rateLimit');

const {
  getAllCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', limiter, getAllCards);
router.delete('/cards/:cardId', limiter, deleteCard);
router.post('/cards', limiter, createCard);
router.put('/cards/:cardId/likes', limiter, likeCard);
router.delete('/cards/:cardId/likes', limiter, dislikeCard);

module.exports = router;
