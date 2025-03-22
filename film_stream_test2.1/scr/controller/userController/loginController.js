    const bcrypt = require("bcrypt");
const { collection, avatarTable } = require("../../model/model");
const flash = require('connect-flash');

const loginPost = async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            req.flash('error', 'Email not found');
            res.redirect("/login");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                req.session.loggedIn = true;
                req.session.user = {
                    name: check.name,
                    email: check.email,
                    isAdmin: check.isAdmin
                };
                if (check.isAdmin) {
                    res.redirect("/ad_home");
                } else {
                    res.redirect("/");
                }
            } else {
                req.flash('error', 'Wrong password');
                res.redirect("/login");
            }
        }
    } catch (error) {
        req.flash('error', 'Wrong details');
        res.redirect("/login");
    }
};

const signupPost = async (req, res) => {
    const data = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(data.email)) {
        req.flash('error', 'Please enter a valid email address.');
        return res.redirect("/signup");
    }

    if (!passwordRegex.test(data.password)) {
        req.flash('error', 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return res.redirect("/signup");
    }

    const existingUser = await collection.findOne({
        $or: [{ name: data.name }, { email: data.email }]
    });

    if (existingUser) {
        if (existingUser.name === data.name) {
            req.flash('error', 'Username already exists. Please choose a different username');
        } else {
            req.flash('error', 'Email already exists. Please choose a different email');
        }
        return res.redirect("/signup");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    const userdata = await collection.insertMany(data);
    console.log(userdata);

    req.session.loggedIn = true;
    req.session.user = {
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false // Ensure isAdmin is set, default to false if not provided
    };
    res.redirect("/");
};

module.exports = { loginPost, signupPost };