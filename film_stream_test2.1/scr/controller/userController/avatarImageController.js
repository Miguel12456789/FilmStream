const { collection } = require("../../model/model");

const avatarImgGet = async (req, res, next) => {
    try {
        // Se o utilizador não estiver logado, apenas segue para a próxima função sem erro
        if (!req.session.user) {
            req.session.user = { avatar_url: "/images/default-avatar.png" };
            return next();
        }

        // Busca o utilizador e seu avatar
        const user = await collection.findOne({ email: req.session.user.email }).populate("avatar_id");

        if (user && user.avatar_id) {
            req.session.user.avatar_url = user.avatar_id.avatar_url;
        } else {
            req.session.user.avatar_url = "/images/default-avatar.png"; // Avatar padrão
        }

        next();
    } catch (error) {
        console.error("Erro ao buscar avatar do usuário:", error);
        req.session.user.avatar_url = "/images/default-avatar.png"; // Prevenir erro de bloqueio
        next();
    }
};

module.exports = { avatarImgGet };
