const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/((((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5])))|((www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\/?))(:\d{2,5})?(\/([0-9a-zA-Z/._:-]+)?#?)?$/.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    default: [],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    default: Date.now,
    type: Date,
  },
});

module.exports = mongoose.model('card', cardSchema);
