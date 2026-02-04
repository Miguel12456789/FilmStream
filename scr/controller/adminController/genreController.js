const { genreTable } = require("../../model/model");
const flash = require('connect-flash');

// Create a genre
const genrePost = async (req, res) => {
    const data = req.body;

    try {
        // Check if genre already exists
        const existingGenre = await genreTable.findOne({ genre_name: data.genre_name });
        if (existingGenre) {
            console.log("O gênero:", data.genre_name, "já existe");
            req.flash('error2', 'Gender already exists');
            return res.redirect('/ad_genre'); // Redireciona para exibir a flash message
        }

        const genre = new genreTable({ genre_name: data.genre_name });
        await genre.save();
        console.log("Género criado:", data);
        console.log("Coleção atribuída:", genre.collection.collectionName);
        req.flash('success2', 'Genre successfully created');
        res.redirect("/ad_genre");
    } catch (error2) {
        console.log("Erro:", error2);
        req.flash('error2', 'Error creating gender');
        res.redirect('/ad_genre');
    }
};

// Get all genres with pagination
const genreGet = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        const query = searchQuery ? { genre_name: { $regex: searchQuery, $options: 'i' } } : {};

        const genres = await genreTable.find(query).skip(skip).limit(limit);
        const totalGenres = await genreTable.countDocuments(query);
        const totalPages = Math.ceil(totalGenres / limit);

        res.render('adminViews/ad_genre', { genres, genreId: req.params.id, currentPage: page, totalPages, searchQuery });
    } catch (error) {
        console.log("Erro ao buscar gêneros:", error);
        req.flash('error2', 'Error fetching genres');
        res.redirect('/ad_genre');
    }
};

// Delete a genre
const genreDelete = async (req, res) => {
    try {
        const genreId = req.params.id;
        await genreTable.findByIdAndDelete(genreId);
        req.flash('success2', 'Genre successfully deleted');
        res.redirect('/ad_genre');
    } catch (error) {
        console.log("Erro ao deletar gênero:", error);
        req.flash('error2', 'Error deleting genre');
        res.redirect('/ad_genre');
    }
};

// Atualizar gênero
const updateGenre = async (req, res) => {
    try {
        const { genre_name } = req.body;
        const { id } = req.params;

        if (!genre_name) {
            req.flash('error2', 'The genre name is required.');
            return res.redirect('/ad_genre');
        }

        // Verifica se já existe um gênero com o mesmo nome
        const existingGenre = await genreTable.findOne({ genre_name });
        if (existingGenre && existingGenre._id.toString() !== id) {
            req.flash('error2', 'Genre already exists.');
            return res.redirect('/ad_genre');
        }

        await genreTable.findByIdAndUpdate(id, { genre_name });

        req.flash('success2', 'Gender updated successfully!');
        res.redirect('/ad_genre');
    } catch (error) {
        console.error(error);
        req.flash('error2', 'Error updating gender.');
        res.redirect('/ad_genre');
    }
};

module.exports = { genrePost, genreGet, genreDelete, updateGenre };