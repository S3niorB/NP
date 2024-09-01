const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
