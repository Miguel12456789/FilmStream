const bcrypt = require("bcrypt");
const { collection, avatarTable } = require("../../model/model");
const flash = require('connect-flash');

const updateUsername = async (req, res) => {
    if (req.session.loggedIn) {
        const newUsername = req.body.username;
        const userEmail = req.session.user.email;

        try {
            const existingUser = await collection.findOne({ name: newUsername });
            if (existingUser) {
                return res.redirect("/account?popup=error");
            }

            await collection.updateOne({ email: userEmail }, { $set: { name: newUsername } });
            req.session.user.name = newUsername;
            return res.redirect("/account?popup=show");
        } catch (error) {
            console.error("Erro ao atualizar o nome de usuário:", error);
            return res.redirect("/account?popup=error");
        }
    } else {
        res.redirect("/login");
    }
};

const getAvatars = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const user = await collection.findOne({ email: req.session.user.email }).populate("avatar_id");

        if (!user) {
            return res.redirect("/login");
        }

        // Verifica se o usuário tem um avatar associado e define a URL
        const avatarUrl = user.avatar_id ? user.avatar_id.avatar_url : "/images/default-avatar.png";
        req.session.user.avatar_url = avatarUrl;

        next();
    } catch (error) {
        console.error("Erro ao buscar avatar do usuário:", error);
        res.status(500).send("Erro no servidor");
    }
};

const getAllAvatars = async (req, res) => {
    try {
        const avatars = await avatarTable.find({});
        res.json(avatars);
    } catch (error) {
        console.error("Erro ao buscar avatares:", error);
        res.status(500).send("Erro no servidor");
    }
};

const updateAvatar = async (req, res) => {
    if (req.session.loggedIn) {
        const avatarUrl = req.body.avatar_url;
        const userEmail = req.session.user.email;

        try {
            const avatar = await avatarTable.findOne({ avatar_url: avatarUrl });
            if (!avatar) {
                return res.status(404).send("Avatar not found");
            }

            await collection.updateOne({ email: userEmail }, { $set: { avatar_id: avatar._id } });
            req.session.user.avatar_url = avatarUrl;
            return res.status(200).send("Avatar updated successfully");
        } catch (error) {
            console.error("Erro ao atualizar o avatar:", error);
            return res.status(500).send("Erro no servidor");
        }
    } else {
        res.status(401).send("Unauthorized");
    }
};

module.exports = { updateUsername, getAvatars, getAllAvatars, updateAvatar };