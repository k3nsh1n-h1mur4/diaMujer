const express = require('express');
const controllers = require('../controllers/controllers.js');
const router = express.Router();


const customerControllers = require('../controllers/controllers.js');


router.get('/', customerControllers.index);
router.get('/list', customerControllers.list);
router.get('/getUserForm', customerControllers.getUserForm);
router.post('/createUser', customerControllers.createUser);
router.get('/loginForm', customerControllers.loginForm);
router.post('/login', customerControllers.login);
router.get('/logout', customerControllers.logout);
router.all('/register', customerControllers.save);
router.get('/delete/:id', customerControllers.delete);
router.get('/update/:id', customerControllers.edit);
router.post('/update/:id', customerControllers.update);
router.get('/qrcode/:id', customerControllers.qrcode);
router.get('/pdf/:id', customerControllers.pdf);



module.exports = router;
