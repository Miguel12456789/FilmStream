const { contentTable, genreTable } = require("../../model/model");

const moviesGet = async (req, res, next) => {
    try {
        console.log("Fetching contents...");

        // Fetch the contents from the database
        req.contents = await contentTable.find({}).lean(); 
        
        console.log("Contents fetched: ", req.contents); 

        // Fetch the genres from the database
        req.genres = await genreTable.find({}).lean();
        
        console.log("Genres fetched: ", req.genres); 

        next(); // Pass to the next middleware
    } catch (error) {
        console.error("Error fetching contents or genres:", error);
        next(error);
    }
};

module.exports = { moviesGet };