const express = require('express');
const { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } = require('../controllers/articleController');

const router = express.Router();

router.post('/', createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById); // Új sor
router.put('/:id', updateArticle); // Új sor
router.delete('/:id', deleteArticle); // Új sor

module.exports = router;
