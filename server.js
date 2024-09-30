const express = require('express');
const sql = require('mssql');
require('dotenv').config();
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
const port = process.env.PORT || 3000; // You can change this for Azure

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.static('public')); // Serve static files from the public folder

// Function to get a connection pool
const getPool = async () => {
    const pool = await sql.connect({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        options: {
            encrypt: true, // Use this if you're connecting to Azure
            trustServerCertificate: true // Set to true if you have SSL issues
        }
    });
    return pool;
};

// Endpoint to fetch data
app.get('/data', async (req, res) => {
    try {
        const pool = await getPool(); // Get a connection pool
        const result = await pool.request().query('SELECT * FROM [User]'); // Replace 'your_table' with your actual table name
        res.json(result.recordset); // Return the fetched records
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve the index.html file at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the index.html file
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
