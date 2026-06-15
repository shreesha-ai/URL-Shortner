const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const { redirectToUrl } = require('./controllers/urlController');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

// Redirection route
app.get('/:shortCode', redirectToUrl);

// Base route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'URL Shortener API' });
});

module.exports = app;
