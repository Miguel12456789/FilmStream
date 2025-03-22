const { contentTable } = require("../../model/model");
const mongoose = require('mongoose');

const mGet = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("Fetching content with ID:", id);

        // Verificar se o ID é um ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid content ID.");
        }

        // Buscar o conteúdo do banco de dados
        req.content = await contentTable.findById(id).lean();

        if (!req.content) {
            return res.status(404).send("Content not found.");
        }

        console.log("Content fetched: ", req.content);

        next(); // Passa para o próximo middleware (navegationController.m)
    } catch (error) {
        console.error("Error fetching content:", error);
        next(error);
    }
};

module.exports = { mGet };