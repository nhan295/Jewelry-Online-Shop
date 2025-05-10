const express = require('express');
const jewelryController = require('../controllers/jewelryController');

const router = express.Router();

module.exports.setup = (app)=>{
    app.use('/api/v1/jew',router)
    
    router.get('/sub_category/:sub_category', jewelryController.getJewByCategory);
    router.get('/search/:name', jewelryController.searchJewByName);
    router.get('/id/:jewelry_id', jewelryController.getJewById);


}
