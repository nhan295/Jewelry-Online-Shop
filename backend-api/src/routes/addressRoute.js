const addressController = require('../controllers/addressController')
const express = require('express');
const router = express.Router();

module.exports.setup = (app)=>{
    app.use('/api/v1/address',router)
    router.get('/provinces',addressController.getProvince);   //done
    router.get('/:province_id/wards/',addressController.getWardByProvince); //done
    router.post('/add/:user_id',addressController.addNewAddress);  //done
    router.put('/edit/:record_id',addressController.editAddress); //done
    router.get('/list/:user_id',addressController.getAddressList);  //done
    router.delete('/delete/:record_id',addressController.delAddress) //done
}