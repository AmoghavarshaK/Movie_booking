CREATE DATABASE MOVIE_BOOKING;
USE MOVIE_BOOKING;
CREATE TABLE user(
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    password VARCHAR(255) NOT NULL
);


CREATE TABLE venues(
	venue_id INT AUTO_INCREMENT PRIMARY KEY,
    vname VARCHAR(255) NOT NULL ,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL DEFAULT 50
);

CREATE TABLE movies(
	movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    description TEXT,
    duration INT ,
    poster_url TEXT,
    relese_date DATE,
    language VARCHAR(50)
);

CREATE TABLE movie_cast(
	movie_id INT,
    cast_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (movie_id,cast_name),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

CREATE TABLE shows (
	movie_id INT NOT NULL,
    venue_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    show_id INT AUTO_INCREMENT UNIQUE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (movie_id, venue_id, start_time),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE
);


CREATE TABLE bookings(
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    PRIMARY KEY(user_id,show_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE
);

CREATE TABLE booked_seats (
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    seat_no VARCHAR(10) NOT NULL,
    PRIMARY KEY (user_id, show_id, seat_no),
    FOREIGN KEY (user_id, show_id) REFERENCES bookings(user_id, show_id) ON DELETE CASCADE
);

CREATE TABLE booking_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    show_id INT,
    action VARCHAR(50),
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE TRIGGER after_booking_insert
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    INSERT INTO booking_log (user_id, show_id, action)
    VALUES (NEW.user_id, NEW.show_id, 'Booking Made');
END //

DELIMITER ;

SELECT * FROM booking_log;



DELIMITER //

CREATE PROCEDURE get_user_profile_bookings(IN userId INT)
BEGIN
    SELECT 
        b.show_id, 
        m.title AS movie_title, 
        v.vname AS venue_name, 
        v.location, 
        s.start_time, 
        s.price, 
        GROUP_CONCAT(bs.seat_no ORDER BY bs.seat_no) AS seats
    FROM bookings b
    JOIN shows s ON b.show_id = s.show_id
    JOIN movies m ON s.movie_id = m.movie_id
    JOIN venues v ON s.venue_id = v.venue_id
    LEFT JOIN booked_seats bs ON b.user_id = bs.user_id AND b.show_id = bs.show_id
    WHERE b.user_id = userId
    GROUP BY b.show_id;
END //

DELIMITER ;
