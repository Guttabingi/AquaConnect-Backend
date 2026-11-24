
const express = require('express');
const cors = require('cors');

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

module.exports = app;
