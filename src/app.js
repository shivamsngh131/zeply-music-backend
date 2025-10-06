const express = require('express');
const cors = require('cors');
const youtubeRoutes = require('./api/youtubeRoutes');

const app = express();

// Middleware
app.use(cors()); // Allows requests from other origins (our frontend)
app.use(express.json()); // Parses incoming JSON requests

// API Routes
app.use('/api', youtubeRoutes);

app.get('/', (req, res) => {
  res.send('Zeply Music Server is running!');
});


module.exports = app;