const express = require('express');
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');
const routes = require('./routes/routes'); // Import the routes
const mongoose = require("mongoose");
const connectDB = require("./config/config");
const dotenv = require("dotenv");
const connectCloudinary = require("./config/cloudinary");
const fileUpload = require('express-fileupload');
const app = express();

dotenv.config();

// Conecte ao Cloudinary
connectCloudinary(); // Utilize a função de configuração

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure: true in production with HTTPS
}));

// Flash middleware
app.use(flash());
// Flash message admin
app.use((req, res, next) => {
    res.locals.error2 = req.flash('error2');
    res.locals.success2 = req.flash('success2');
    next();
});

// Convert data into JSON format
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Use EJS as the view engine
app.set('view engine', 'ejs');
// Static file
app.use(express.static("public"));
app.use(express.static("scr")); // Serve static files from the scr folder

// Use the routes
app.use('/', routes);

connectDB();

// Error 404
app.use((req, res) => {
    res.status(404).render("components/404"); // Renderiza a página 404.ejs
});


module.exports = app;

// Ctrl + C to stop the server
// node scr/server.js to start the server
