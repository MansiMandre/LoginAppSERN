const express = require("express");
const router = express.Router();
const isAuthenticated = require("../Middleware/auth");

router.get("/dashboard", isAuthenticated, (req, res) => {
    res.send("Welcome to your dashboard");
});

module.exports = router;
