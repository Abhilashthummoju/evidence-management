const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database
const dbPath = path.join(__dirname, 'evidence.db');

// Connect to the SQLite database (it will create the file if it doesn't exist)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables
db.serialize(() => {
    // Create Case table
    db.run(`
        CREATE TABLE IF NOT EXISTS [Case] (
            Case_no TEXT PRIMARY KEY,
            Case_name TEXT NOT NULL,
            Evidences TEXT
        );
    `, (err) => {
        if (err) {
            console.error('Error creating Case table', err.message);
        } else {
            console.log('Case table created successfully.');
        }
    });

    // Create People table
    db.run(`
        CREATE TABLE IF NOT EXISTS People (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            password TEXT NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error('Error creating People table', err.message);
        } else {
            console.log('People table created successfully.');
        }
    });

    // Create Admins table
    db.run(`
        CREATE TABLE IF NOT EXISTS Admins (
            id TEXT PRIMARY KEY,
            password TEXT NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error('Error creating Admins table', err.message);
        } else {
            console.log('Admins table created successfully.');
        }
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing the database connection', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
