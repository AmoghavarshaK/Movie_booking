const bcrypt = require("bcryptjs");

// Database connection (adjust as needed)
const db = require("./dbconfig"); 

async function addAdmin(username, email, password) {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the admin into the database
        const sql = "INSERT INTO user (username, email, role, password) VALUES (?, ?, 'admin', ?)";
        await db.execute(sql, [username, email, hashedPassword]);

        console.log("✅ Admin added successfully!");
    } catch (error) {
        console.error("❌ Error adding admin:", error.message);
    }
}

// Example Usage
addAdmin("admin", "admin@gmail.com", "4321");
