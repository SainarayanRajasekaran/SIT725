const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/myprojectDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose Schema & Model
const quoteSchema = new mongoose.Schema({
  quote: String
});


const Quote = mongoose.model("Quote", quoteSchema);

// GET endpoint to retrieve a random quote from MongoDB
app.get('/api/getQuote', async (req, res) => {
  try {
    const quotes = await Quote.find();
    if (quotes.length === 0) return res.status(404).json({ error: "No quotes found." });

    res.json(quotes); // or use { quotes } if you prefer named key
  } catch (error) {
    res.status(500).json({ error: "Error retrieving quotes." });
  }
});

// POST endpoint to add a new quote to MongoDB
app.post('/api/PostQuote', async (req, res) => {
  const { quote } = req.body;

  if (!quote || typeof quote !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid quote.' });
  }

  try {
    const newQuote = new Quote({ quote });
    await newQuote.save();
    res.status(200).json({ message: "Quote saved successfully.", quote: newQuote });
  } catch (error) {
    res.status(500).json({ error: "Error saving quote." });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.send('Server is healthy!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
