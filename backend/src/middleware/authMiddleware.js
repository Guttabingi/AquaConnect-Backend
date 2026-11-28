
const jwt = require('jsonwebtoken');

// Verify the JWT token
const authenticateUser = (req, res, next) => {
    try {
        // Get the Authorization header
        const authHeader = req.headers.authorization;

        // Check whether the token was provided
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication token is required.'
            });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach user information to the request
        req.user = decoded;

        // Continue to the next middleware or route
        next();

    } catch (error) {
        console.error('Authentication error:', error.message);

        return res.status(401).json({
            message: 'Invalid or expired authentication token.'
        });
    }
};

module.exports = { authenticateUser };
