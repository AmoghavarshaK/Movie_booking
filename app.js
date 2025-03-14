const express = require("express");
const app = express();
const db = require("./dbconfig");
const path = require('path');
const ejsMate  = require('ejs-mate')
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/user")

const session = require('express-session');
const flash = require('connect-flash')
const cookieParser = require('cookie-parser');

//ejs setup
app.set('view engine' , 'ejs');
app.set("views", path.join(__dirname , "views"));

app.engine('ejs', ejsMate); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public"))); 
app.use(cookieParser());

//session and flash setup
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());



app.use(async (req, res, next) => {
    const token = req.cookies.token; // Get JWT from cookies

    if (!token) {
        res.locals.currUser = null; // No user logged in
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await db.query("SELECT id, username, email, role FROM user WHERE id = ?", [decoded.id]);

        if (users.length === 0) {
            res.locals.currUser = null;
            return next();
        }

        req.user = users[0]; // Store full user details in `req.user`
        res.locals.currUser = users[0]; // Store in `res.locals.currUser` for EJS
    } catch (err) {
        console.log("JWT Verification Failed:", err.message);
        res.locals.currUser = null;
    }

    next();
});


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use('/',userRouter)

app.get('/' ,(req ,res)=>{
    res.render("./common/home.ejs");
})

app.all('*',(req,res,next)=>{
    let error = new Error("Page Not Found");
    error.statusCode = 404;
    next(error);
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    console.log(err);

    res.status(statusCode).render("common/error", { message, statusCode });
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});