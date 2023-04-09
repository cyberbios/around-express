const Card = require('../models/card');

const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  OK,
  CREATED,
} = require('../constants/utils');

module.exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(OK).send({ data: cards });
  } catch (err) {
    res.status(DEFAULT).send({ message: 'We have encountered an error' });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(CREATED).send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`,
      });
      res
        .status(BAD_REQUEST)
        .send({ message: 'Invalid data passed for creating a card' });
    } else {
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId).orFail(
      new Error('Card not found')
    );
    res.status(OK).send({ data: card });
  } catch (err) {
    if (err.message === 'Card not found') {
      res.status(NOT_FOUND).send({ message: 'Card not found' });
    } else if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Invalid card ID' });
    } else {
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(new Error('Card not Found'));
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Invalid ID format' });
    } else if (err.message === 'Card not Found') {
      res.status(NOT_FOUND).send({ message: 'Card not found' });
    } else {
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(new Error('Card not Found'));
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Invalid ID format' });
    } else if (err.message === 'Card not Found') {
      res.status(NOT_FOUND).send({ message: 'Card not found' });
    } else {
      res.status(DEFAULT).send({ message: 'We have encountered an error' });
    }
  }
};
