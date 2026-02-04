#  Film Stream

Film Stream is a web application for managing movies and TV series, allowing users to organize content and administrators to manage the entire catalog through a complete admin panel.

---

##  Features

### Users
- Secure registration and login
- Avatar and profile editing
- Movie search and filtering
- Responsive interface

### Administration
- Dashboard with statistics
- Full CRUD for movies, users, genres, avatars, and streaming platforms
- Image uploads via Cloudinary
- Pagination and search system
- Permission control

---

##  Technologies

- Front-end: HTML, CSS, JavaScript, EJS  
- Back-end: Node.js, Express.js  
- Database: MongoDB  
- Cloud: Cloudinary  
- Extras: Multer, bcrypt, dotenv   

---

##  How to Run the Project

### 1. Clone the repository
```bash
git clone https://github.com/teu-username/film-stream.git
```

### 2. Install dependencies
```bash
npm install
```
### 3. Create a `.env` file

Create a `.env` file in the project root with the following content:

```env
PORT=5000
MONGO_URL=your_mongodb_connection

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```
### 4. Start the server
```bash
node scr/server.js
