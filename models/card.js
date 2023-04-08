const mongoose = require('mongoose');
const { LINK_REGEXP } = require('../constants/index');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return LINK_REGEXP.test(v);
      },
      message: 'The link must be filled...',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model('card', cardSchema);

module.exports = Card;
