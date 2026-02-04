const { whereTable } = require("../../model/model");
const flash = require('connect-flash');

// Create a where
const wherePost = async (req, res) => {
    const data = req.body;

    try {
        // Check if where already exists
        const existingWhere = await whereTable.findOne({ where_name: data.where_name });
        if (existingWhere) {
            console.log("O streaming:", data.where_name, "já existe");
            req.flash('error2', 'Streaming already exists');
            return res.redirect('/ad_where'); // Redireciona para exibir a flash message
        }

        const where = new whereTable({ where_name: data.where_name });
        await where.save();
        console.log("Streaming criado:", data);
        console.log("Coleção atribuída:", where.collection.collectionName);
        req.flash('success2', 'Streaming successfully created');
        res.redirect("/ad_where");
    } catch (error) {
        console.log("Erro:", error);
        req.flash('error2', 'Error creating streaming');
        res.redirect('/ad_where');
    }
};

// Get all wheres with pagination
const whereGet = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        const query = searchQuery ? { where_name: { $regex: searchQuery, $options: 'i' } } : {};

        const wheres = await whereTable.find(query).skip(skip).limit(limit);
        const totalWheres = await whereTable.countDocuments(query);
        const totalPages = Math.ceil(totalWheres / limit);

        res.render('adminViews/ad_where', { wheres, whereId: req.params.id, currentPage: page, totalPages, searchQuery });
    } catch (error) {
        console.log("Erro ao buscar straming:", error);
        req.flash('error2', 'Error fetching streaming');
        res.redirect('/ad_where');
    }
};

// Delete a where
const whereDelete = async (req, res) => {
    try {
        const whereId = req.params.id;
        await whereTable.findByIdAndDelete(whereId);
        req.flash('success2', 'Streaming successfully deleted');
        res.redirect('/ad_where');
    } catch (error) {
        console.log("Erro ao deletar streaming:", error);
        req.flash('error2', 'Error deleting streaming');
        res.redirect('/ad_where');
    }
};

// Atualizar streaming
const updateWhere = async (req, res) => {
    try {
        const { where_name } = req.body;
        const { id } = req.params;

        if (!where_name) {
            req.flash('error2', 'Streaming name is required.');
            return res.redirect('/ad_where');
        }

        // Verifica se já existe um streaming com o mesmo nome
        const existingWhere = await whereTable.findOne({ where_name });
        if (existingWhere && existingWhere._id.toString() !== id) {
            req.flash('error2', 'Streaming already exists.');
            return res.redirect('/ad_where');
        }

        await whereTable.findByIdAndUpdate(id, { where_name });

        req.flash('success2', 'Streaming updated successfully!');
        res.redirect('/ad_where');
    } catch (error) {
        console.error(error);
        req.flash('error2', 'Error updating streaming.');
        res.redirect('/ad_where');
    }
};

module.exports = { wherePost, whereGet, whereDelete, updateWhere };