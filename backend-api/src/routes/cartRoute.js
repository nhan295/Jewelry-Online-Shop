const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

module.exports.setup = (app) =>{
    app.use('/api/v1/cart',router)

    router.get('/user/:user_id', cartController.getCartData);
    router.post('/add',cartController.addCart);
    router.delete('/delete', cartController.deleteCartItem);
    router.put('/update',cartController.updateCart)

    
}
