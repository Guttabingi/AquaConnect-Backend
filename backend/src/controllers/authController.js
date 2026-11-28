const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new customer
const registerUser = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        // Validate required fields
        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long.'
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether email or phone already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR phone = $2',
            [normalizedEmail, phone.trim()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: 'Email or phone number is already registered.'
            });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Assign the customer role automatically
        const role = 'customer';

        // Save user in the database
        const result = await pool.query(
            `INSERT INTO users
            (full_name, email, phone, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, full_name, email, phone, role, is_active, created_at`,
            [
                full_name.trim(),
                normalizedEmail,
                phone.trim(),
                passwordHash,
                role
            ]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            message: 'Registration successful.',
            user,
            token
        });

    } catch (error) {
        console.error('Registration error:', error.message);

        return res.status(500).json({
            message: 'An error occurred during registration.'
        });
    }
};

// Login an existing user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Find user by email
        const result = await pool.query(
            `SELECT id, full_name, email, phone, password_hash, role, is_active
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const user = result.rows[0];

        // Check account status
        if (!user.is_active) {
            return res.status(403).json({
                message: 'Your account has been deactivated.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove password hash before responding
        delete user.password_hash;

        return res.status(200).json({
            message: 'Login successful.',
            user,
            token
        });

    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            message: 'An error occurred during login.'
        });
    }
};

module.exports = { registerUser, loginUser };