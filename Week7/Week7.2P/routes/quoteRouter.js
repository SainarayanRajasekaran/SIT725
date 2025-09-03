const express = require('express');
const { createQuote, getQuotes } = require('../controllers/quoteController');

const router = express.Router();

router.post('/PostQuote', createQuote);
router.get('/getQuote', getQuotes);

module.exports = router;
