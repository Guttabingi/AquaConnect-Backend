
require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

pool.query('SELECT NOW()')
    .then(result => {
        console.log('Database connected successfully!');
        console.log('Database server time:', result.rows[0].now);
    })
    .catch(error => {
        console.error('Database connection failed:', error.message);
    });

app.listen(PORT, () => {
    console.log(`AquaConnect server running on port ${PORT}`);
});