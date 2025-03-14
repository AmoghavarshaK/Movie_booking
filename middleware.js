const jwt = require("jsonwebtoken");
const db = require("./dbconfig")
require("dotenv").config();

// Middleware to check if the user is logged in
module.exports.isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        req.session.redirectUrl = req.originalUrl; // Store the URL before redirecting
        req.flash("error", "You should be logged in!");
        return res.redirect("/login");
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details from the database
        const [users] = await db.query("SELECT id, username, email, role FROM user WHERE id = ?", [decoded.id]);
        if (users.length === 0) {
            req.flash("error", "User not found. Please log in again.");
            return res.redirect("/login");
        }

        req.user = users[0]; // Store full user info in req.user
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message); // Debugging
        req.flash("error", "Session expired. Please log in again.");
        return res.redirect("/login");
    }
    
};

// Middleware to save redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if the user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        req.flash("error", "Admin access only.");
        return res.redirect("/");
    }
    next();
};
