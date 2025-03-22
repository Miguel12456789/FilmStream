const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'default_folder'; // Pasta padrão caso não seja especificado
    
    if (file.fieldname === 'avatar') {
      folder = 'avatar_img';
    } else if (file.fieldname === 'content') {
      folder = 'content_img';
    }
    
    return {
      folder: folder,
      format: 'png', // Define o formato das imagens
      public_id: file.originalname, // Nome do arquivo
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;