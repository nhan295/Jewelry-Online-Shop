const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router()

module.exports.setup = (app) =>{
    app.use('/api/v1/user',router)

    router.get('/',userController.getUserData)
    router.post('/register',userController.register)
    router.post('/login',userController.login)
    router.post('/logout',userController.logout)

}