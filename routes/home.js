const express = require("express");
const router = express.Router();

const { 
    renderHome,
    getProfile,
    searchMovies

} = require("../controllers/home.js");
const { isLoggedIn } = require("../middleware.js");

router.get('/about' ,(req ,res)=>{
    res.render("./common/about.ejs") 
});

router.get('/profile', isLoggedIn , getProfile);
router.get("/search", searchMovies);
router.get('/' , renderHome);

module.exports = router;