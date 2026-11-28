
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to AquaConnect API!'
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);

module.exports = app;