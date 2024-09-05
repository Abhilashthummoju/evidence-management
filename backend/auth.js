require('dotenv').config({ path: '../.env' });
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./evidence.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

const hashPasswd = (passwd) => {
    const saltRounds = 10;
    let hashedPassword = bcrypt.hashSync(passwd, saltRounds);
    return hashedPassword;
}

const authToken = (userId) => {
    const accessToken = jwt.sign({ id: userId }, `${process.env.TOKEN_SECRET}`);
    return accessToken;
}

// MiddleWare
const authUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user.id;
        next();
    });
}

const validateUser = async ({ id, passwd, userType }) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT password FROM ' + (userType === 'admin' ? 'Admins' : 'People') + ' WHERE id = ?', [id], async (err, row) => {
            if (err) {
                reject("Internal Server Error");
            } else if (!row) {
                resolve("invalid");
            } else {
                const match = await bcrypt.compare(passwd, row.password);
                resolve(match ? "success" : "invalid");
            }
        });
    });
}

module.exports = { authToken, hashPasswd, validateUser, authUser };
