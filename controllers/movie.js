const db = require("../dbconfig");

module.exports.movieDetails = async (req, res) => {
    try {
        const movie_id = req.params.movie_id;

        // Fetch movie details
        const [movie] = await db.query("SELECT * FROM movies WHERE movie_id = ?", [movie_id]);
        if (!movie.length) {
            req.flash("error", "Movie not found.");
            return res.redirect("/");
        }

        // Fetch cast members
        const [cast] = await db.query("SELECT cast_name FROM movie_cast WHERE movie_id = ?", [movie_id]);

        // Fetch only upcoming shows sorted by start time
        const [shows] = await db.query(`
            SELECT shows.show_id, shows.start_time, shows.price, 
                   venues.vname, venues.location 
            FROM shows 
            JOIN venues ON shows.venue_id = venues.venue_id 
            WHERE shows.movie_id = ? 
              AND shows.start_time > NOW()
            ORDER BY shows.start_time ASC
        `, [movie_id]);

        // Convert price to a number to avoid "toFixed is not a function" error
        shows.forEach(show => {
            show.price = parseFloat(show.price); // Ensure it's a number
        });

        res.render("./movie/movieDetails.ejs", { movie: movie[0], cast, shows });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load movie details.");
        res.redirect("/");
    }
};



module.exports.getBookingPage = async (req, res) => {
    try {
        const show_id = req.params.show_id;

        // Fetch show details, including venue capacity
        const [showDetails] = await db.query(`
            SELECT s.show_id, s.start_time, s.price, 
                   m.title AS movie_title, 
                   v.vname AS venue_name, v.location, v.capacity 
            FROM shows s
            JOIN movies m ON s.movie_id = m.movie_id
            JOIN venues v ON s.venue_id = v.venue_id
            WHERE s.show_id = ?`, 
            [show_id]
        );

        if (!showDetails.length) {
            req.flash("error", "Show not found.");
            return res.redirect("/");
        }

        const show = showDetails[0];

        // Fetch booked seats for this show
        const [bookedSeats] = await db.query(
            "SELECT seat_no FROM booked_seats WHERE show_id = ?",
            [show_id]
        );

        // Convert bookedSeats result into an array of seat numbers
        const bookedSeatNumbers = bookedSeats.map(row => row.seat_no);

        // Generate seat layout dynamically based on venue capacity
        const rows = Math.ceil(show.capacity / 10); // Assume 10 seats per row
        const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, rows);
        res.render("./movie/bookSeats", { show, bookedSeatNumbers, rowLabels });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load booking page.");
        res.redirect("/");
    }
};
module.exports.bookSeats = async (req, res) => {
    try {
        const show_id = req.params.show_id;
        const user_id = req.user.id;

        let { seats } = req.body;

        if (typeof seats === "string") {
            try {
                seats = JSON.parse(seats);
            } catch (error) {
                console.error("Error parsing seats:", error);
                req.flash("error", "Invalid seat selection.");
                return res.redirect(`/movies/book/${show_id}`);
            }
        }

        if (!Array.isArray(seats) || seats.length === 0) {
            req.flash("error", "Invalid seat selection.");
            return res.redirect(`/movies/book/${show_id}`);
        }

        const seatNumbers = seats.map(seat => seat.trim());

        console.log("Final seatNumbers:", seatNumbers);

        await db.query(
            "INSERT IGNORE INTO bookings (user_id, show_id) VALUES (?, ?)", 
            [user_id, show_id]
        );
        const seatInsertValues = seatNumbers.map(seat => [user_id, show_id, seat]);
        await db.query("INSERT INTO booked_seats (user_id, show_id, seat_no) VALUES ?", [seatInsertValues]);

        req.flash("success", "Seats booked successfully!");
        return res.redirect(`/movies/ticket/${user_id}/${show_id}`);
    } catch (error) {
        console.error("Booking error:", error);
        req.flash("error", "Booking failed.");
        res.redirect(`/movies/book/${req.params.show_id}`);
    }
};

module.exports.showTicket = async (req, res) => {
    try {
        const { user_id, show_id } = req.params;

        // Get booking details
        const [ticket] = await db.query(
            `SELECT 
                m.title AS movie_title, 
                s.start_time, 
                v.vname AS venue_name, 
                v.location,
                s.price
            FROM shows s
            JOIN movies m ON s.movie_id = m.movie_id
            JOIN venues v ON s.venue_id = v.venue_id
            WHERE s.show_id = ?`, 
            [show_id]
        );

        if (ticket.length === 0) {
            req.flash("error", "Invalid ticket.");
            return res.redirect("/");
        }

        // Get booked seats
        const [seats] = await db.query(
            `SELECT seat_no FROM booked_seats WHERE user_id = ? AND show_id = ?`, 
            [user_id, show_id]
        );

        const seatNumbers = seats.map(seat => seat.seat_no);

        res.render("./movie/ticket", {
            ticket: ticket[0],
            seats: seatNumbers
        });
    } catch (error) {
        console.error("Ticket retrieval error:", error);
        req.flash("error", "Could not retrieve ticket details.");
        res.redirect("/");
    }
};
