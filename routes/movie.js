const {movieDetails , getBookingPage , bookSeats , showTicket} = require('../controllers/movie');
const express = require("express");
const {isLoggedIn} = require("../middleware")
const router = express.Router();

router.get("/:movie_id" , movieDetails);
router.get("/book/:show_id" , isLoggedIn , getBookingPage);
router.post("/book-seats/:show_id" ,isLoggedIn, bookSeats);
router.get("/ticket/:user_id/:show_id", isLoggedIn, showTicket);

module.exports = router; 