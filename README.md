#  Film Stream

Film Stream é uma aplicação web para gestão de filmes e séries, permitindo aos utilizadores organizar conteúdos e aos administradores gerir todo o catálogo através de um painel administrativo completo.

---

##  Funcionalidades

### Utilizadores
- Registo e login seguro
- Alteração de avatar e perfil
- Pesquisa e filtragem de filmes
- Interface responsiva

### Administração
- Dashboard com estatísticas
- CRUD de filmes, utilizadores, géneros, avatares e plataformas
- Upload de imagens via Cloudinary
- Paginação e sistema de pesquisa
- Controlo de permissões

---

##  Tecnologias

- Front-end: HTML, CSS, JavaScript, EJS  
- Back-end: Node.js, Express.js  
- Base de dados: MongoDB  
- Cloud: Cloudinary  
- Extras: Multer, bcrypt, dotenv  

---

##  Como Rodar o Projeto

### 1. Clonar repositório
```bash
git clone https://github.com/teu-username/film-stream.git
```

### 2. Instalar dependências
```bash
npm install
```
### 3. Criar ficheiro `.env`

Cria um ficheiro `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=5000
MONGO_URL=your_mongodb_connection

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```
### 4. Iniciar servidor
```bash
node scr/server.js




