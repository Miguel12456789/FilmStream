const { collection, avatarTable } = require("../../model/model");
const flash = require('connect-flash');
const bcrypt = require("bcrypt");

const userPost = async (req, res) => {
    const data = req.body;
    // console.log(data);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(data.email)) {
        req.flash('error2', 'Please enter a valid email address.');
        return res.redirect("/ad_user");
    }

    if (!passwordRegex.test(data.password)) {
        req.flash('error2', 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return res.redirect("/ad_user");
    }

    const existingUser = await collection.findOne({
        $or: [{ name: data.name }, { email: data.email }]
    });

    if (existingUser) {
        if (existingUser.name === data.name) {
            req.flash('error2', 'Username already exists. Please choose a different username');
        } else {
            req.flash('error2', 'Email already exists. Please choose a different email');
        }
        return res.redirect("/ad_user");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
    data.isAdmin = data.isAdmin === 'true';

    // Buscar um avatar padrão se não for enviado um avatar pelo usuário
    let defaultAvatar = await avatarTable.findOne();
    
    if (!defaultAvatar) {
        req.flash('error2', 'No default avatar found. Please upload an avatar first.');
        return res.redirect("/ad_user");
    }

    data.avatar_id = defaultAvatar._id; // Salvar a referência ao avatar
    
    const newUser = new collection(data);
    await newUser.save();

    console.log(`User created with avatar: ${defaultAvatar.avatar_url}`);
    req.flash('success2', 'User was created successfully');
    res.redirect("/ad_user");
};
const userGet = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        const query = searchQuery ? {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ]
        } : {};

        const users = await collection.find(query).skip(skip).limit(limit).populate('avatar_id');
        const totalUsers = await collection.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        res.render('adminViews/ad_user', { users, currentPage: page, totalPages, searchQuery });
    } catch (error) {
        console.log("Erro ao buscar usuários:", error);
        req.flash('error2', 'Error fetching users');
        res.redirect('/ad_user');
    }
};

const userDelete = async (req, res) => {
    try {
        const userId = req.params.id;
        await collection.findByIdAndDelete(userId);
        req.flash('success2', 'User successfully deleted');
        res.redirect('/ad_user');
    } catch (error) {
        console.log("Erro ao deletar usuário:", error);
        req.flash('error2', 'Error deleting user');
        res.redirect('/ad_user');
    }
};

const userUpdate = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, isAdmin, avatar_id } = req.body;

        const existingUser = await collection.findOne({
            $or: [{ name }, { email }],
            _id: { $ne: userId }
        });

        if (existingUser) {
            if (existingUser.name === name) {
                req.flash('error2', 'Username already exists. Please choose a different username');
            } else {
                req.flash('error2', 'Email already exists. Please choose a different email');
            }
            return res.redirect('/ad_user');
        }

        await collection.findByIdAndUpdate(userId, { name, email, isAdmin: isAdmin === 'true', avatar_id });
        req.flash('success2', 'User successfully updated');
        res.redirect('/ad_user');
    } catch (error) {
        console.log("Erro ao atualizar usuário:", error);
        req.flash('error2', 'Error updating user');
        res.redirect('/ad_user');
    }
};

module.exports = { userGet, userDelete, userPost, userUpdate };
