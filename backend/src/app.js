
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const { authenticateUser } = require('./middleware/authMiddleware');

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
// Protected test route
app.get('/api/protected', authenticateUser, (req, res) => {
    res.json({
        message: 'You have accessed a protected route!',
        user: req.user
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);


module.exports = app;