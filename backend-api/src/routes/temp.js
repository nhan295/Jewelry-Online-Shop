const addressController = require('../controllers/addressController')
const express = require('express');
const router = express.Router();

module.exports.setup = (app)=>{
    app.use('/api/v1/address',router)
    router.get('/provinces',addressController.getProvince);
    router.get('/:province_id/wards/',addressController.getWardByProvince);

}