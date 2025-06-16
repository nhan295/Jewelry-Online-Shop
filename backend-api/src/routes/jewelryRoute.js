const express = require('express');
const jewelryController = require('../controllers/jewelryController');

const router = express.Router();

module.exports.setup = (app)=>{
    app.use('/api/v1/jew',router)

    router.get('/sub_category/:sub_id', jewelryController.getJewBySubCategory);  //req.param
    router.get('/category/:category', jewelryController.getSubCateByCategory);
    router.get('/search/:jewelry_name', jewelryController.searchJewByName);
    router.get('/id/:jewelry_id/color/:color_id', jewelryController.getJewById);
    router.get('/all',jewelryController.getAllJew);
    router.get('/category/:categoryName', jewelryController.getJewByCategoryName)


}
