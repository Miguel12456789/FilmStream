const express = require('express');
const router = express.Router();

const accountController = require('../controller/userController/accountController'); 
const avatarImageController = require('../controller/userController/avatarImageController');
const navegationController = require('../controller/navegationController');
const loginController = require('../controller/userController/loginController');
const genreController = require('../controller/adminController/genreController');
const whereController = require('../controller/adminController/whereController');
const avatarController = require('../controller/adminController/avatarController');
const adUserController = require('../controller/adminController/adUserController');
const ad_homeController = require('../controller/adminController/ad_homeController');
const contentController = require('../controller/adminController/contentController');
const {mGet} = require('../controller/userController/mController');
const {homeGet} = require('../controller/userController/homeController');
const { checkisAdmin } = require('../controller/navegationController');
const { getContentById } = require('../controller/adminController/contentController');
const { moviesGet } = require('../controller/userController/moviesController');

// Rotas públicas
router.get("/", homeGet, avatarImageController.avatarImgGet, navegationController.home);
router.get("/login", navegationController.loginGet);
router.post("/login", loginController.loginPost);
router.get("/signup", navegationController.signupGet);
router.post("/signup", loginController.signupPost);
router.get("/logout", navegationController.logout);

// Account routes
router.get("/account", avatarImageController.avatarImgGet, navegationController.accountGet);
router.post("/update-username", accountController.updateUsername);
router.post("/update-avatar", accountController.updateAvatar); // Nova rota
router.get('/avatars', navegationController.accountGet, accountController.getAvatars);
router.get('/all-avatars', accountController.getAllAvatars);

// Rotas de conteúdos
router.get("/movies", moviesGet, avatarImageController.avatarImgGet, navegationController.movies);



router.get("/m/:id", mGet, avatarImageController.avatarImgGet, navegationController.m);

// Admin routes (protegidas pelo checkisAdmin)
router.get("/ad_sidebar", checkisAdmin, navegationController.ad_sidebarGet);

// Content routes
router.get("/ad_movies", checkisAdmin, contentController.getGenresWhereAndRenderForm);
router.post("/create_content", checkisAdmin, contentController.contentPost);
router.post("/delete_content/:id", checkisAdmin, contentController.contentDelete);
router.post('/update_content', checkisAdmin, contentController.contentUpdate);
router.get('/content/:id', getContentById);

// Home routes
router.get("/ad_home", checkisAdmin, ad_homeController.ad_homeGet);

// Genre routes
router.get("/ad_genre", checkisAdmin, genreController.genreGet);
router.post('/create-genre', checkisAdmin, genreController.genrePost);
router.post('/delete-genre/:id', checkisAdmin, genreController.genreDelete);
router.post('/update-genre/:id', checkisAdmin, genreController.updateGenre);

// Where routes
router.get("/ad_where", checkisAdmin, whereController.whereGet);
router.post('/create-where', checkisAdmin, whereController.wherePost);
router.post('/delete-where/:id', checkisAdmin, whereController.whereDelete);
router.post('/update-where/:id', checkisAdmin, whereController.updateWhere);

// Avatar routes
router.get('/ad_avatar', checkisAdmin, avatarController.avatarGet);
router.post('/create-avatar', checkisAdmin, avatarController.avatarPost); 
router.post('/delete-avatar/:id', checkisAdmin, avatarController.avatarDelete);
router.post('/update-avatar/:id', checkisAdmin, avatarController.updatedAvatar);

// Admin user routes
router.get('/ad_user', checkisAdmin, adUserController.userGet);
router.post('/create-user', checkisAdmin, adUserController.userPost);
router.post('/delete-user/:id', checkisAdmin, adUserController.userDelete);
router.post('/update-user/:id', checkisAdmin, adUserController.userUpdate);

module.exports = router;
