const db = require("../dbconfig");


module.exports.addVenue = async (req, res) => {
    try {
        const { vname, location, capacity } = req.body;
        if (!vname || !location || !capacity) {
            req.flash("error", "All fields are required");
            return res.redirect("/admin/venues");
        }

        const [venueResult] = await db.query(
            "INSERT INTO venues (vname, location, capacity) VALUES (?, ?, ?)",
            [vname, location, capacity]
        );

        req.flash("success", "Venue added successfully!");
        res.redirect("/admin/venues");
    } catch (error) {
        console.error(error);
        req.flash("error", "Internal server error");
        res.redirect("/admin/venues");
    }
};

// Add a new movie
module.exports.addMovie = async (req, res) => {
    try {
        const { title, genre, duration, poster_url, release_date, language, description, cast } = req.body;

        // Validate input
        if (!title || !genre || !duration || !poster_url || !release_date || !language || !description) {
            req.flash("error", "All fields except cast are required");
            return res.redirect("/admin/movies/add");
        }

        // Insert movie into the database
        const movieQuery = "INSERT INTO movies (title, genre, duration, poster_url, relese_date, language, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [movieResult] = await db.query(movieQuery, [title, genre, duration, poster_url, release_date, language, description]);

        const movie_id = movieResult.insertId;

        // Insert cast members
        if (Array.isArray(cast)) {
            for (const cast_name of cast) {
                if (cast_name.trim() !== "") {
                    await db.query(
                        "INSERT INTO movie_cast (movie_id, cast_name) VALUES (?, ?)", 
                        [movie_id, cast_name]
                    );
                }
            }
        }

        req.flash("success", "Movie and cast added successfully!");
        return res.redirect("/admin/movies");
    } catch (error) {
        console.error(error);
        req.flash("error", "Internal server error");
        return res.redirect("/admin/movies/add");
    }
};



module.exports.addShow = async (req, res) => {
    try {
        const { movie_id, venue_id, start_time, price } = req.body;
        if (!movie_id || !venue_id || !start_time || !price) {
            req.flash("error", "All fields are required");
            return res.redirect("/admin/shows");
        }

        const [showResult] = await db.query(
            "INSERT INTO shows (movie_id, venue_id, start_time, price) VALUES (?, ?, ?, ?)",
            [movie_id, venue_id, start_time, price]
        );

        req.flash("success", "Show added successfully!");
        res.redirect("/admin/shows");
    } catch (error) {
        console.error(error);
        req.flash("error", "Internal server error");
        res.redirect("/admin/shows");
    }
};



module.exports.renderAddVenue = (req, res) => {
    res.render("admin/addVenue");
};

module.exports.renderAddMovie = (req, res) => {
    res.render("admin/addMovie");
};

module.exports.renderAddShow = async (req, res) => {
    try {
        const [movies] = await db.query("SELECT movie_id, title FROM movies");
        const [venues] = await db.query("SELECT venue_id, vname, location FROM venues");

        res.render("admin/addShow", { movies, venues });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load movies and venues.");
        res.redirect("/admin/dashboard");
    }
};


