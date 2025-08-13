const path = require('path');
const express = require('express');

const { connectDB } = require('./config');     
const { quoteRouter } = require('./routes');   

const app = express();
const PORT = process.env.PORT || 3001;

// DB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', quoteRouter);

// Health
app.get('/health', (_req, res) => res.send('Server is healthy!'));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
