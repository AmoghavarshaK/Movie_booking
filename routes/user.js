const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { isLoggedIn } = require("../middleware"); // Import authentication middleware

// Register Route
router.get("/register", (req, res) => {
    res.render("auth/register"); // Render registration page
});
router.post("/register", userController.registerUser);

// Login Routes
router.get("/login", (req, res) => {
    res.render("auth/login"); // Render login page
});
router.post("/login", userController.loginUser);

// Logout Route
router.get("/logout",  userController.logoutUser);


module.exports = router;
