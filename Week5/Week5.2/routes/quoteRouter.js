const router = require('express').Router();
const { quoteController: ctrl } = require('../controllers');

// API endpoints
router.get('/getQuote', ctrl.getAll);
router.post('/PostQuote', ctrl.create);

module.exports = router;
