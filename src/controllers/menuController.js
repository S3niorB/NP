const Menu = require('../models/Menu');

const createMenu = async (req, res) => {
  const { name } = req.body;

  try {
    const newMenu = new Menu({ name });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMenu,
  getMenus,
};
