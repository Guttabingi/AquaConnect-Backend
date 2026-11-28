const express = require('express');
const { registerUser } = require('../controllers/authController');

const router = express.Router();

// Customer registration
router.post('/register', registerUser);

module.exports = router;