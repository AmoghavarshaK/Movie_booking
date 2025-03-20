const express = require("express");
const router = express.Router();

const { 
    renderHome,
    getProfile

} = require("../controllers/home.js");
const { isLoggedIn } = require("../middleware.js");

router.get('/about' ,(req ,res)=>{
    res.render("./common/about.ejs") 
});

router.get('/profile', isLoggedIn , getProfile);
router.get('/' , renderHome);

module.exports = router;