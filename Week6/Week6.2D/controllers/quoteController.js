const Quote = require('../model/quoteModel');

// Create a new quote and also testing
async function createQuote(req, res) {
  try {
    const { quote, author } = req.body || {};
    if (!quote) return res.status(400).json({ message: 'quote is required' });
    const doc = await Quote.create({ quote, author });
    return res.status(200).json({ message: 'Quote saved successfully.', quote: doc });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

// Retrieve all quotes
async function getQuotes(_req, res) {
  try {
    const docs = await Quote.find().lean();
    return res.status(200).json(docs);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = { createQuote, getQuotes };
