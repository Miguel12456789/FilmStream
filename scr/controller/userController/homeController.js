const { contentTable } = require("../../model/model");

const homeGet = async (req, res, next) => {
    try {
        console.log("Fetching contents...");

        // Buscar os conteúdos do banco de dados
        req.contents = await contentTable.find({}).lean(); 
        
        console.log("Contents fetched: ", req.contents); // Debugging

        next(); // Passa para o próximo middleware
    } catch (error) {
        console.error("Error fetching contents:", error);
        next(error);
    }
};

module.exports = { homeGet };
