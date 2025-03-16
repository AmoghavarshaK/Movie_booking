const db = require('./dbconfig.js');

async function initializeData() {
    try {
        // Clear existing data
        await db.query('DELETE FROM booked_seats');
        await db.query('DELETE FROM bookings');
        await db.query('DELETE FROM shows');
        await db.query('DELETE FROM movie_cast');
        await db.query('DELETE FROM movies');
        await db.query('DELETE FROM venues');

        // Reset Auto Increment
        await db.query('ALTER TABLE venues AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE movies AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE shows AUTO_INCREMENT = 1');

        // Insert Venues
        await db.query(`
            INSERT INTO venues (vname, location, capacity) VALUES
            ('Grand Cinema', 'Anna Salai, Chennai', 100),
            ('Skyline Theater', 'MG Road, Bengaluru', 80),
            ('Moonlight Cinema', 'Bandra, Mumbai', 60),
            ('Regal Cinemas', 'Connaught Place, Delhi', 120),
            ('Sunset Theater', 'Banjara Hills, Hyderabad', 90),
            ('Star Cineplex', 'Jayanagar, Bengaluru', 85),
            ('PVR Cinemas', 'Andheri West, Mumbai', 95),
            ('IMAX Theater', 'DLF Mall, Delhi', 110),
            ('Galaxy Cinema', 'Gachibowli, Hyderabad', 75),
            ('Sathyam Cinemas', 'T Nagar, Chennai', 130)
        `);

        // Insert Movies with multiple languages and genres
        await db.query(`
            INSERT INTO movies (title, genre, description, duration, poster_url, relese_date, language) VALUES
            ('Inception', 'science fiction', 'A mind-bending thriller.', 148, 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg', '2010-07-16', 'English'),
            ('Interstellar', 'science fiction', 'A journey beyond the stars.', 169, 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '2014-11-07', 'English'),
            ('The Matrix', 'science fiction', 'A hacker discovers reality is an illusion.', 136, 'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', '1999-03-31', 'English'),
            ('Avatar', 'science fiction', 'A human falls for a Navi on Pandora.', 162, 'https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg', '2009-12-18', 'English'),
            ('Titanic', 'drama', 'A love story set on the Titanic.', 195, 'https://th.bing.com/th/id/OIP.OqH4vPLjPGrgruv5o8tdngHaJ4?rs=1&pid=ImgDetMain', '1997-12-19', 'English'),
            ('Joker', 'drama', 'The origin story of the Joker.', 122, 'https://image.tmdb.org/t/p/original/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', '2019-10-04', 'English'),
            ('KGF', 'action', 'The rise of Rocky in the underworld.', 155, 'https://m.media-amazon.com/images/M/MV5BM2M0YmIxNzItOWI4My00MmQzLWE0NGYtZTM3NjllNjIwZjc5XkEyXkFqcGc@._V1_.jpg', '2018-12-21', 'Kannada'),
            ('Vikram', 'thriller', 'A high-octane thriller.', 174, 'https://i0.wp.com/moviegalleri.net/wp-content/uploads/2021/07/Vijay-Sethupathi-Kamal-Fahadh-Faasil-Vikram-Movie-First-Look-Poster-HD.jpg', '2022-06-03', 'Tamil'),
            ('RRR', 'action', 'A fictional story based on revolutionaries.', 187, 'https://image.tmdb.org/t/p/original/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg', '2022-03-25', 'Telugu'),
            ('Drishyam', 'thriller', 'A gripping family drama with a thrilling twist.', 163, 'https://m.media-amazon.com/images/I/714kDfwueCL._AC_UF894,1000_QL80_.jpg', '2015-07-31', 'Hindi'),
            ('Blade Runner 2049', 'science fiction', 'A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard, who has been missing for thirty years.', 164, 'https://image.tmdb.org/t/p/original/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', '2017-10-06', 'English'),
            ('The Martian', 'science fiction', 'An astronaut, presumed dead, is stranded on Mars and must rely on his ingenuity to survive and signal Earth for rescue.', 144, 'https://image.tmdb.org/t/p/original/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg', '2015-10-02', 'English'),
            ('Arrival', 'science fiction', 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.', 116, 'https://image.tmdb.org/t/p/original/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', '2016-11-11', 'English')
        `);

        // Insert Cast for Movies
        await db.query(`
            INSERT INTO movie_cast (movie_id, cast_name) VALUES
            (1, 'Leonardo DiCaprio'),
            (1, 'Joseph Gordon-Levitt'),
            (2, 'Matthew McConaughey'),
            (2, 'Anne Hathaway'),
            (3, 'Keanu Reeves'),
            (3, 'Laurence Fishburne'),
            (4, 'Sam Worthington'),
            (4, 'Zoe Saldana'),
            (5, 'Leonardo DiCaprio'),
            (5, 'Kate Winslet'),
            (6, 'Joaquin Phoenix'),
            (7, 'Yash'),
            (8, 'Kamal Haasan'),
            (9, 'NTR Jr.'),
            (9, 'Ram Charan'),
            (10, 'Ajay Devgn'),
            (11, 'Ryan Gosling'),
            (11, 'Harrison Ford'),
            (12, 'Matt Damon'),
            (12, 'Jessica Chastain'),
            (13, 'Amy Adams'),
            (13, 'Jeremy Renner')
        `);
        await db.query(`
            INSERT INTO shows (movie_id, venue_id, start_time) VALUES
            (1, 1, '2025-03-16 14:00:00'),
            (1, 2, '2025-03-16 17:00:00'),
            (2, 3, '2025-03-16 19:30:00'),
            (2, 4, '2025-03-16 21:00:00'),
            (3, 5, '2025-03-17 15:00:00'),
            (3, 6, '2025-03-17 18:30:00'),
            (4, 7, '2025-03-17 20:00:00'),
            (4, 8, '2025-03-18 16:00:00'),
            (5, 9, '2025-03-18 19:00:00'),
            (5, 10, '2025-03-18 21:30:00'),
            (6, 1, '2025-03-19 14:00:00'),
            (6, 2, '2025-03-19 17:00:00'),
            (7, 3, '2025-03-19 19:30:00'),
            (7, 4, '2025-03-19 21:00:00'),
            (8, 5, '2025-03-20 15:00:00'),
            (8, 6, '2025-03-20 18:30:00'),
            (9, 7, '2025-03-20 20:00:00'),
            (9, 8, '2025-03-21 16:00:00'),
            (10, 9, '2025-03-21 19:00:00'),
            (10, 10, '2025-03-21 21:30:00'),
            (11, 1, '2025-03-22 14:00:00'),
            (11, 2, '2025-03-22 17:00:00'),
            (12, 3, '2025-03-22 19:30:00'),
            (12, 4, '2025-03-22 21:00:00'),
            (13, 5, '2025-03-23 15:00:00'),
            (13, 6, '2025-03-23 18:30:00');
        `);
        console.log('Database reset and initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await db.end();
    }
}

initializeData();
