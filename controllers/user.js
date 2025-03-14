const db = require("../dbconfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Controller
module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const [existingUser] = await db.query("SELECT * FROM user WHERE email = ?", [email]);

        if (existingUser.length > 0) {  // Check array length properly
            req.flash("error", "Email is already registered!");
            return res.redirect("/register");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.query("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", 
                      [username, email, hashedPassword]);

        req.flash("success", "Registered successfully! Please login.");
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong!");
        res.redirect("/register");
    }
};

// Login Controller
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const [users] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (users.length === 0) {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/login");
        }

        const user = users[0];
       
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/login");
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Store token in cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        
        const redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clear it after use

        req.flash("success", "Login successful!");
        res.redirect(redirectUrl || "/");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong!");
        res.redirect("/login");
    }
};

// Logout Controller
module.exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully!");
    res.redirect("/");
};
