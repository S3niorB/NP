const express = require('express');
const { createMenu, getMenus } = require('../controllers/menuController');

const router = express.Router();

router.post('/', createMenu);
router.get('/', getMenus);

module.exports = router;
