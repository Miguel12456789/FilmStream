const { contentTable, genreTable, whereTable } = require("../../model/model");
const flash = require('connect-flash');
const express = require('express');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const upload = require('../../middleware/multer');
const connectCloudinary = require('../../config/cloudinary');
const mongoose = require('mongoose');

const contentPost = async (req, res) => {
    console.log("📥 Recebendo requisição para criar conteúdo...");

    if (!req.body || Object.keys(req.body).length === 0) {
        console.log("❌ Erro: Nenhum dado recebido no body.");
        req.flash('error2', 'No data received');
        return res.redirect('/ad_movies');
    }

    const data = req.body;
    console.log("✅ Dados recebidos:", data);

    try {
        console.log("📂 Conteúdo de req.files:", req.files);
        const imgContentFile = req.files?.poster_image;
        const imgBackgroundFile = req.files?.background_image;

        if (!imgContentFile || !imgBackgroundFile) {
            console.log("❌ Erro: Arquivos não recebidos.");
            req.flash('error2', 'Files not received');
            return res.redirect('/ad_movies');
        }

        console.log("☁️ Enviando imagens para o Cloudinary...");
        const imgContentUploadResponse = await cloudinary.uploader.upload(imgContentFile.tempFilePath, {
            folder: "content_img",
            use_filename: true
        });

        const imgBackgroundUploadResponse = await cloudinary.uploader.upload(imgBackgroundFile.tempFilePath, {
            folder: "content_img",
            use_filename: true
        });

        console.log("📝 Criando conteúdo no banco de dados...");

        const genreIds = Array.isArray(req.body.genre) ?
            req.body.genre.map(id => new mongoose.Types.ObjectId(id)) :
            [new mongoose.Types.ObjectId(req.body.genre)];

        const whereIds = Array.isArray(req.body.where) ?
            req.body.where.map(id => new mongoose.Types.ObjectId(id)) :
            [new mongoose.Types.ObjectId(req.body.where)];


        const content = new contentTable({
            content_name: data.content_name,
            min: data.min,
            description: data.description,
            release_date: data.release_date,
            img_content: imgContentUploadResponse.secure_url,
            img_background: imgBackgroundUploadResponse.secure_url,
            contentGenres: genreIds, // Gêneros como array
            contentWhere: whereIds,   // Onde assistir como array
            average_rate: data.average_rate // Adicionando o campo average_rate
        });

        await content.save();
        console.log("✅ Conteúdo criado com sucesso:", content);
        req.flash('success2', 'Content successfully created');
        res.redirect("/ad_movies");

    } catch (error2) {
        console.log("❌ Erro ao criar conteúdo:", error2);
        req.flash('error2', 'Error creating content');
        res.redirect('/ad_movies');
    }
};


const getGenresWhereAndRenderForm = async (req, res) => {
    try {
        console.log("🔍 Buscando filmes, gêneros e plataformas de streaming...");

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        const query = searchQuery ? { content_name: { $regex: searchQuery, $options: 'i' } } : {};

        const genres = await genreTable.find();
        const whereToWatch = await whereTable.find();
        const movies = await contentTable.find(query)
            .populate("contentGenres")  // Popular os gêneros
            .populate("contentWhere")   // Popular os locais de exibição
            .skip(skip)
            .limit(limit);

        const totalMovies = await contentTable.countDocuments(query);
        const totalPages = Math.ceil(totalMovies / limit);

        console.log("✅ Dados carregados com sucesso!");
        res.render('adminViews/ad_movies', { genres, whereToWatch, movies, currentPage: page, totalPages, searchQuery });
    } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
        res.status(500).send('Erro no servidor');
    }
};

const contentDelete = async (req, res) => {
    const contentId = req.params.id;

    try {
        console.log("🔍 Buscando conteúdo para deletar...");
        const content = await contentTable.findById(contentId);

        if (!content) {
            console.log("❌ Conteúdo não encontrado.");
            req.flash('error2', 'Content not found');
            return res.redirect('/ad_movies');
        }

        console.log("☁️ Deletando imagens do Cloudinary...");
        const imgContentPublicId = content.img_content.split('/').pop().split('.')[0];
        const imgBackgroundPublicId = content.img_background.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`content_img/${imgContentPublicId}`);
        await cloudinary.uploader.destroy(`content_img/${imgBackgroundPublicId}`);

        console.log("🗑️ Deletando conteúdo do MongoDB...");
        await contentTable.findByIdAndDelete(contentId);

        console.log("✅ Conteúdo deletado com sucesso.");
        req.flash('success2', 'Content successfully deleted');
        res.redirect('/ad_movies');
    } catch (error) {
        console.log("❌ Erro ao deletar conteúdo:", error);
        req.flash('error2', 'Error deleting content');
        res.redirect('/ad_movies');
    }
};

const getContentById = async (req, res) => {
    const contentId = req.params.id;

    try {
        const content = await contentTable.findById(contentId)
            .populate("contentGenres")
            .populate("contentWhere");

        if (!content) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json(content);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ error: "Error fetching content" });
    }
};


const contentUpdate = async (req, res) => {
    const contentId = req.body.content_id;

    try {
        console.log("🔍 Buscando conteúdo para atualizar...");
        const content = await contentTable.findById(contentId);

        if (!content) {
            console.log("❌ Conteúdo não encontrado.");
            req.flash('error2', 'Content not found');
            return res.redirect('/ad_movies');
        }

        // Atualizar os campos do conteúdo
        content.content_name = req.body.content_name;
        content.min = req.body.min;
        content.description = req.body.description;
        content.release_date = req.body.release_date;
        content.average_rate = req.body.average_rate; // Atualizando o campo average_rate


        // Atualizar os gêneros e onde assistir
        content.contentGenres = Array.isArray(req.body.genre) ?
            req.body.genre.map(id => new mongoose.Types.ObjectId(id)) :
            [new mongoose.Types.ObjectId(req.body.genre)];

        content.contentWhere = Array.isArray(req.body.where) ?
            req.body.where.map(id => new mongoose.Types.ObjectId(id)) :
            [new mongoose.Types.ObjectId(req.body.where)];

        // Atualizar as imagens se novas imagens forem enviadas
        if (req.files?.poster_image) {
            const imgContentUploadResponse = await cloudinary.uploader.upload(req.files.poster_image.tempFilePath, {
                folder: "content_img",
                use_filename: true
            });
            content.img_content = imgContentUploadResponse.secure_url;
        }

        if (req.files?.background_image) {
            const imgBackgroundUploadResponse = await cloudinary.uploader.upload(req.files.background_image.tempFilePath, {
                folder: "content_img",
                use_filename: true
            });
            content.img_background = imgBackgroundUploadResponse.secure_url;
        }

        await content.save();
        console.log("✅ Conteúdo atualizado com sucesso:", content);
        req.flash('success2', 'Content successfully updated');
        res.redirect("/ad_movies");

    } catch (error) {
        console.log("❌ Erro ao atualizar conteúdo:", error);
        req.flash('error2', 'Error updating content');
        res.redirect('/ad_movies');
    }
};

module.exports = { contentPost, getGenresWhereAndRenderForm, contentDelete, getContentById, contentUpdate };