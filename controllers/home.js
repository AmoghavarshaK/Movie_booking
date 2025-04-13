const db = require("../dbconfig");


// Render Home Page
module.exports.renderHome = async (req, res) => {
    try {
        // Fetch movies sorted by genre
        const [movies] = await db.query(`SELECT * FROM movies ORDER BY genre`);

        // Fetch top 10 recent movies
        const [recentMovies] = await db.query(`
            SELECT * FROM movies 
            ORDER BY relese_date DESC 
            LIMIT 10
        `);

        // Group movies by genre
        const moviesByGenre = {};
        movies.forEach(movie => {
            if (!moviesByGenre[movie.genre]) {
                moviesByGenre[movie.genre] = [];
            }
            moviesByGenre[movie.genre].push(movie);
        });

        res.render("common/home.ejs", { moviesByGenre, recentMovies, movies: null, query: "" });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load movies.");
        res.redirect("/");
    }
};

// Search Movies
module.exports.searchMovies = async (req, res) => {
    try {
        const query = req.query.query; // Get search input
        if (!query) {
            req.flash("error", "Please enter a movie name.");
            return res.redirect("/");
        }

        // Fetch movies matching search query
        const [movies] = await db.query(`
            SELECT * FROM movies 
            WHERE title LIKE ? 
            ORDER BY relese_date DESC
        `, [`%${query}%`]);

        res.render("common/home.ejs", { moviesByGenre: null, recentMovies: null, movies, query });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong while searching.");
        res.redirect("/");
    }
};



module.exports.getProfile = async (req, res) => {
    try {
        const user_id = req.user.id;

        const [bookings] = await db.query(`CALL get_user_profile_bookings(?)`, [user_id]);

        // Note: MySQL stored procedures return results in [0], so you need bookings[0]
        res.render("./common/profile", { user: req.user, bookings: bookings[0] });
    } catch (error) {
        console.error("Error fetching profile:", error);
        req.flash("error", "Could not load profile.");
        res.redirect("/");
    }
};

