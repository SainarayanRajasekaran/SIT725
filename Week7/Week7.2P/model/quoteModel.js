const { Schema, model } = require('mongoose');

const QuoteSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = model('Quote', QuoteSchema);
