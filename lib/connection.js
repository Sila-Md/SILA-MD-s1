const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 8000;

// Import the main router from index.js
const mainRouter = require('../index'); 

// Increase event listeners limit
require('events').EventEmitter.defaultMaxListeners = 500;

// Serve static files from public directory (iko uko tu)
app.use(express.static(path.join(__dirname, '../public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Main routes - mount the main router
app.use('/', mainRouter);

// Pairing page route (lib folder)
app.get('/pair', async (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

// Main page route (lib folder)
app.get('/main', async (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Home page - redirect to main
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║      🐢 SILA MD MINI BOT 🐢          ║
║                                      ║
║   Server running successfully!       ║
║   Port: ${PORT}                         ║
║   Status: Online                     ║
║                                      ║
║   Admin Panel: http://localhost:${PORT}/admin ║
║   Dashboard: http://localhost:${PORT}/dashboard ║
║   Settings: http://localhost:${PORT}/settings ║
║   Pair Page: http://localhost:${PORT}/pair ║
║                                      ║
╚══════════════════════════════════════╝
    `);
});

module.exports = app;
