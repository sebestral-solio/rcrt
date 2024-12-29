const express = require('express')
const router = express.Router()
const passport = require('passport');
const { handleGoogleCallback } = require('../helper/googleAuth');
const { jwt_auth, user_role_auth} = require('../middleware/auth_middleware');

router.use(passport.initialize());
router.use(passport.session());

const authloginController = require('../controller/auth_controller/login')
const authsignupController = require('../controller/auth_controller/signup')
const authpasswordController = require('../controller/auth_controller/password')
const authindexController = require('../controller/auth_controller/index')

const  upload  = require('../helper/pancard_multer');

router.get('/', authindexController.index_page);
router.get('/login', authloginController.login_page);

router.post('/news_letter', authindexController.news_letter);

router.post('/feedback', authindexController.feedback)

router.post('/login', authloginController.login);
router.post('/signup', authsignupController.signup);

router.get('/forgot', authpasswordController.forgot_page);
router.post('/forgot', authpasswordController.forgot);

router.get('/forgot_change', jwt_auth, authpasswordController.forgot_page_change);
router.post('/forgot_change', jwt_auth, authpasswordController.forgot_change);

router.get('/new_password', authpasswordController.new_password_page);
router.post('/new_password', authpasswordController.new_password);

router.get('/new_password_change', jwt_auth, authpasswordController.new_password_page_change);
router.post('/new_password_change', jwt_auth, authpasswordController.new_password_change);

router.get('/verify-email', authpasswordController.set_password_page);
router.post('/set_password', upload.single('PancardImage'), authpasswordController.set_password);

router.get('/cancel-signin', jwt_auth, user_role_auth, authpasswordController.cancel_signin)

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), handleGoogleCallback);

module.exports = router