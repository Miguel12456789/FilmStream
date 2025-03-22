const { name } = require('ejs');
const mongoose = require('mongoose');

//Tabela Utilizador
const UserSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
    user_Date: { type: Date, default: Date.now },
    avatar_id: { type: mongoose.Schema.Types.ObjectId, ref: 'avatar' } // Adiciona referência ao avatar
})

// Tabela avatar
const avatarSchema = new mongoose.Schema({
    avatar_name: { type: String, required: true },  // Nome do arquivo
    avatar_url: { type: String, required: true },  // URL da imagem
    avatar_Date: { type: Date, default: Date.now },
});

// Tabela conteúdo
const ContentSchema = new mongoose.Schema({
    content_name: { type: String, required: true },
    watched: { type: Boolean, default: false },
    description: { type: String, required: true },
    min: { type: Number, required: true },
    comment: { type: String },
    average_rate: { type: Number, min: 1, max: 10, default: 1.0 },
    release_date: { type: Date, required: true },
    img_content: { type: String, required: true },
    img_background: { type: String, required: true },
    content_Date: { type: Date, default: Date.now },
    contentGenres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'genero' }], // Agora é um array
    contentWhere: [{ type: mongoose.Schema.Types.ObjectId, ref: 'onde_assistir' }] // Agora é um array
});

// Tabela genero
const GenreSchema = new mongoose.Schema({
    genre_name: { type: String, required: true },
    genre_Date: { type: Date, default: Date.now }
});

// Tabela onde assistir
const WhereSchema = new mongoose.Schema({
    where_name: { type: String, required: true },
    where_Date: { type: Date, default: Date.now }
});


//collection Part
const collection = new mongoose.model("utilizador", UserSchema);
const avatarTable = new mongoose.model("avatar", avatarSchema);
const genreTable = new mongoose.model("genero", GenreSchema);
const whereTable = new mongoose.model("onde_assistir", WhereSchema);
const contentTable = new mongoose.model("conteudo", ContentSchema);

module.exports = { collection, genreTable, whereTable, avatarTable, contentTable };
