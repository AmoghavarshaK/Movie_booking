const db = require("../dbconfig");
module.exports.renderHome = async (req, res) => {
    try {
        const [movies] = await db.query(`
            SELECT *
            FROM movies
            ORDER BY genre
        `);

        // Group movies by genre
        const moviesByGenre = {};
        movies.forEach(movie => {
            if (!moviesByGenre[movie.genre]) {
                moviesByGenre[movie.genre] = [];
            }
            moviesByGenre[movie.genre].push(movie);
        });

        res.render("common/home.ejs", { moviesByGenre });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load movies.");
        res.redirect("/");
    }
};
