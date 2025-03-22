const { render } = require("ejs");
const mongoose = require("mongoose");

const checkLoggedIn = (req, res, next) => {
    if (!req.session.loggedIn) {
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect("/login");
    }
    next();
};

// Renderiza a pagina normalmente
const renderPage = (page) => (req, res) => {
    res.render(page, { 
        navFile: req.session.loggedIn ? 'nav_in' : 'nav', 
        user: req.session.user, 
        footer: 'footer'
    });
};

const renderWithError = (page) => (req, res) => {
    const error = req.flash('error')[0];
    res.render(page, {
        footer: 'footer', 
        error 
    });
};


const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/");
        }
        res.redirect("/");
    });
};

const accountGet = (req, res) => {
    if (!req.session.loggedIn) return checkLoggedIn(req, res, () => {});
    renderPage("userViews/account")(req, res);
};

const checkisAdmin = (req, res, next) => {
    console.log("Verificando admin:", req.session?.user);
    if (!req.session?.user?.isAdmin) {
        console.log("Acesso negado para:", req.session?.user?.email);
        req.flash('error', 'Access denied.');
        return res.redirect("/login");
    }
    next();
};

const home = (req, res) => {
    res.render("userViews/home", { 
        navFile: req.session.loggedIn ? 'nav_in' : 'nav', 
        user: req.session.user,
        contents: req.contents, // Adicionando os conteúdos à renderização
        footer: 'footer'
    });
};

const m = (req, res) => {
    console.log("Navbar carregada:", req.session.loggedIn ? 'nav_in' : 'nav');
    res.render("userViews/m", { 
        navFile: req.session.loggedIn ? 'nav_in' : 'nav', 
        user: req.session.user,
        content: req.content,
        footer: 'footer'
    });
};


const movies = (req, res) => {
    console.log("Navbar carregada:", req.session.loggedIn ? 'nav_in' : 'nav');
    res.render("userViews/shows", { 
        navFile: req.session.loggedIn ? 'nav_in' : 'nav', 
        user: req.session.user,
        contents: req.contents, // Pass contents to the view
        genres: req.genres, 
        footer: 'footer'
    });
};

const moviesGet = renderPage("movies");

const ad_sidebarGet = renderPage("adminViews/ad_sidebar");
const ad_homeGet = renderPage("adminViews/ad_home");
const ad_moviesGet = renderPage("adminViews/ad_movies");
const ad_moreGet = renderPage("adminViews/ad_more");
const ad_genreGet = renderPage("adminViews/ad_genre");
const ad_whereGet = renderPage("adminViews/ad_where");
const ad_avatarGet = renderPage("adminViews/ad_avatar");
const ad_userGet = renderPage("adminViews/ad_user");


const loginGet = renderWithError("userViews/login");
const signupGet = renderWithError("userViews/signup");

module.exports = { home, loginGet, signupGet, accountGet, logout, moviesGet, m, ad_homeGet, ad_sidebarGet, ad_moviesGet, ad_moreGet, ad_genreGet, ad_whereGet, ad_avatarGet, ad_userGet, checkisAdmin, movies };