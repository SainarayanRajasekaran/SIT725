const { Quote } = require('../model');

exports.getAll = async (req, res, next) => {
  try {
    const quotes = await Quote.find().sort();
    res.status(200).json(quotes);          
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { quote } = req.body;
    if (!quote || !quote.trim()) return res.status(400).json({ error: 'Please provide a valid quote.' });
    const saved = await Quote.create({ quote: quote.trim() });
    res.status(200).json({ message: 'Quote saved successfully.', quote: saved });
  } catch (e) { next(e); }
};

