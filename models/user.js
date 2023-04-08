const mongoose = require('mongoose');
const { LINK_REGEXP } = require('../constants/index');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return LINK_REGEXP.test(v);
      },
      message: 'The avatar must be filled....',
    },
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
