const { collection, genreTable, whereTable, contentTable } = require("../../model/model");
const flash = require('connect-flash');
const ad_homeGet = async (req, res) => {
    try {
        const searchQuery = req.query.search || '';

        const query = searchQuery ? { content_name: { $regex: searchQuery, $options: 'i' } } : {};

        const users = await collection.find().sort({ user_Date: -1 });
        const totalUsers = await collection.countDocuments();

        const genres = await genreTable.find().sort({ genre_Date: -1 });
        const wheres = await whereTable.find().sort({ where_Date: -1 });

        const totalContents = await contentTable.countDocuments(query);
        
        const totalGenres = await genreTable.countDocuments();

        const contents = await contentTable.find(query)
            .sort({ content_Date: -1 })
            .populate("contentGenres")
            .populate("contentWhere");

        res.render('adminViews/ad_home', { users, genres, wheres, totalUsers, totalContents, totalGenres, contents, searchQuery });
    } catch (error) {
        console.error("Error fetching data:", error);
        req.flash('error', 'Error fetching data');
        res.redirect('/ad_home');
    }
}

const ad_homePost = async (req, res) => {
    try {
        const users = await collection.find().sort({ user_Date: -1 });
        const genres = await genreTable.find().sort({ genre_Date: -1 });
        const wheres = await whereTable.find().sort({ where_Date: -1 });
        const totalUsers = users.length;
        const totalContents = await contentTable.countDocuments();

        res.render('adminViews/ad_home', { users, genres, wheres, totalUsers, totalContents });
    } catch (error) {
        console.error("Error fetching data:", error);
        req.flash('error', 'Error fetching data');
        res.redirect('/ad_home');
    }
}

module.exports = { ad_homePost, ad_homeGet };