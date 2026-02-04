const express = require('express');
const { avatarTable } = require("../../model/model");
const flash = require('connect-flash');
const cloudinary = require('cloudinary').v2; // Import Cloudinary diretamente
const fileUpload = require('express-fileupload');
const upload = require('../../middleware/multer');
const connectCloudinary = require('../../config/cloudinary'); // Importe a função de configuração

// Remova a configuração do Cloudinary
// connectCloudinary(); // Utilize a função de configuração

const avatarGet = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    const query = searchQuery ? { avatar_name: { $regex: searchQuery, $options: 'i' } } : {};

    const avatars = await avatarTable.find(query).skip(skip).limit(limit);
    const totalAvatars = await avatarTable.countDocuments(query);
    const totalPages = Math.ceil(totalAvatars / limit);

    res.render('adminViews/ad_avatar', { avatars, avatarId: req.params.id, currentPage: page, totalPages, searchQuery });
  } catch (error) {
    console.log("Erro ao buscar avatar:", error);
    req.flash('error2', 'Error fetching avatar');
    res.redirect('/ad_avatar');
  }
};

// Rota para fazer upload do avatar
const avatarPost = async (req, res) => {
  try {
    console.log("Recebendo requisição para upload...");

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("Erro: Nenhuma imagem foi enviada.");
      req.flash('error2', 'No images were sent.');
      return res.redirect('/ad_avatar');
    }

    const avatarFile = req.files.avatar;
    const avatarName = req.body.avatar_name;

    // Verificar se o nome do avatar já existe
    const existingAvatar = await avatarTable.findOne({ avatar_name: avatarName });
    if (existingAvatar) {
      console.log("Erro: Nome do avatar já existe.");
      req.flash('error2', 'Avatar name already exists.');
      return res.redirect('/ad_avatar');
    }

    console.log(`Arquivo recebido: ${avatarFile.name}, Tipo: ${avatarFile.mimetype}`);

    // ✅ Agora, garantimos que o `upload` está correto
    const uploadResponse = await cloudinary.uploader.upload(avatarFile.tempFilePath, {
      folder: "avatar_img",
      use_filename: true
    });

    console.log("✅ Imagem enviada para o Cloudinary com sucesso!");
    console.log(`🌍 URL da imagem: ${uploadResponse.secure_url}`);

    // Salva no MongoDB
    const newAvatar = new avatarTable({
      avatar_name: avatarName,
      avatar_url: uploadResponse.secure_url
    });

    await newAvatar.save();

    console.log("✅ Imagem salva no MongoDB com sucesso!");
    console.log(`📂 Nome: ${avatarName}, URL: ${uploadResponse.secure_url}`);

    req.flash('success2', 'Avatar sent successfully!');
    res.redirect('/ad_avatar');
  } catch (error2) {
    console.error("❌ Erro ao fazer upload:", error2);
    req.flash('error', 'Error uploading avatar.');
    res.redirect('/ad_avatar');
  }
};

const avatarDelete = async (req, res) => {
  try {
    const avatarId = req.params.id;
    const avatar = await avatarTable.findById(avatarId);

    if (!avatar) {
      req.flash('error2', 'Avatar not found.');
      return res.redirect('/ad_avatar');
    }

    // Deletar a imagem do Cloudinary
    const publicId = avatar.avatar_url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`avatar_img/${publicId}`);

    // Deletar o avatar da base de dados
    await avatarTable.findByIdAndDelete(avatarId);

    req.flash('success2', 'Avatar successfully deleted !');
    res.redirect('/ad_avatar');
  } catch (error) {
    console.error("❌ Erro ao deletar avatar:", error);
    req.flash('error2', 'Error deleting avatar.');
    res.redirect('/ad_avatar');
  }
};

const updatedAvatar = async (req, res) => {
  try {
    const { id, name } = req.body;

    // Verificar se o nome do avatar já existe
    const existingAvatar = await avatarTable.findOne({ avatar_name: name, _id: { $ne: id } });
    if (existingAvatar) {
      req.flash('error2', 'Avatar name already exists.');
      return res.redirect('/ad_avatar');
    }

    const avatar = await avatarTable.findById(id);
    if (!avatar) {
      req.flash('error2', 'Avatar not found.');
      return res.redirect('/ad_avatar');
    }

    // Atualizar o nome do avatar
    avatar.avatar_name = name;

    // Se um novo arquivo de imagem foi enviado, faça o upload para o Cloudinary
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar;
      const uploadResponse = await cloudinary.uploader.upload(avatarFile.tempFilePath, {
        folder: "avatar_img",
        use_filename: true
      });

      // Deletar a imagem antiga do Cloudinary
      const publicId = avatar.avatar_url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`avatar_img/${publicId}`);

      // Atualizar a URL da imagem
      avatar.avatar_url = uploadResponse.secure_url;
    }

    await avatar.save();
    req.flash('success2', 'Avatar updated successfully!');
    res.redirect('/ad_avatar');
  } catch (error) {
    console.error("❌ Erro ao atualizar avatar:", error);
    req.flash('error2', 'Error updating avatar.');
    res.redirect('/ad_avatar');
  }
};



// Exporta as rotas
module.exports = { avatarGet, avatarPost, avatarDelete, updatedAvatar };