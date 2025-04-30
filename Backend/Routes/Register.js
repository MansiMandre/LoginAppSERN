const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../Config/db");
const isAuthenticated = require("../Middleware/auth");

// Register route
router.post("/register", (req, res) => {
    console.log('heyyy');
    console.log(req.body);
    console.log('console3')
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send("All fields required");

    db.query("SELECT * FROM employee WHERE Email = ?", [username], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }

        if (result.length > 0) {
            return res.status(400).send("User already exists");
        }

        bcrypt.hash(password, 10, (err, hashPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Error hashing password");
            }

            db.query("INSERT INTO employee (Email, Password) VALUES (?, ?)", [username, hashPassword], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error inserting user");
                }

                res.status(200).send("User registered successfully");
            });
        });
    });
});

// Login route

router.post('/', (req, res) => {  // <--- No need to repeat '/login' here
    const { email, password } = req.body;

    const query = 'SELECT * FROM employee WHERE Email = ? AND Password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            req.session.userId = results[0].Id;
            console.log('User logged in, session object:', req.session);
            return res.send('Login successful');
        } else {
            return res.status(401).send('Invalid credentials');
        }
    });
});



  

// Logout route
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Error logging out");
        res.send("Logged out successfully");
    });
});

module.exports = router;
