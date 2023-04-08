const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      const error = new Error('Cards not found');
      error.status = 404;
      throw error;
    })
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'castError') {
        res.status(400).send({ message: 'Invalid card ID' });
      } else {
        res.status(500).send({ message: 'We have encountered an error' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`;
        res
          .status(400)
          .send({ message: 'Invalid data passed for creating a card' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(Card)
    .orFail(() => {
      const error = new Error('Card not found');
      error.status = 404;
      throw error;
    })

    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid card ID' });
      } else {
        res.status(500).send({ message: 'We have encountered an error' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID format' });
      } else if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.status(500).send({ message: 'We have encountered an error' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID format' });
      } else if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.status(500).send({ message: 'We have encountered an error' });
    });
};
