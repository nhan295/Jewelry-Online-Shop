const addressModel = require('../models/addressModel')

const getProvince = async(req,res)=>{
    try{
        const result = await addressModel.getProvince()

        if(result){
            res.json(result)
        }else{
            res.status(400).json({message: 'No provinces found'})
        }

    }catch(err){
        res.status(500).json({message:'Error fetching province'})
    }
}

const getWardByProvince = async(req,res) =>{
    try{
        const {province_id} = req.params
        const result = await addressModel.getWardByProvince(province_id)
        if(result){
            res.json(result)
        }else{
            res.status(400).json({message: 'No wards found'})
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: 'Error fetching wards from province'})
    }

}
const addNewAddress = async(req,res)=>{
    
    const {user_id} = req.params
    const {record_username,record_mobile,province_id,ward_id,street_address} = req.body
    try{
        if(!record_username || !record_mobile || !province_id || !ward_id || !street_address){
            return res.status(400).json({message: 'You entered a missing field.'})
        }
        await addressModel.addNewAddress(user_id,record_username,record_mobile,province_id,ward_id,street_address)
        return res.status(200).json({message: 'New address added'})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Failed to add address'})
    }
}

const editAddress = async(req,res) =>{
    try{
        const {user_id,record_id} = req.params
        const {record_username,record_mobile,province_id,ward_id,street_address} = req.body

        if(!user_id){
            return res.status(401).json({message: "You haven't logged in yet"})
        }
        await addressModel.editAddress(user_id,record_id,{
            record_username,
            record_mobile,
            province_id,
            ward_id,
            street_address
        })
        return res.status(200).json({message: 'User address updated'})

    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Failed to edit address'})
    }
}

const delAddress = async(req,res) =>{
    try{
        const {user_id,record_id} = req.params
        await addressModel.delAddress(user_id,record_id)
        return res.status(200).json({message: 'Address deleted'})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Failed to delete address'})
    }
}

const getAddressList = async(req,res) =>{
    const {user_id} = req.params
    try{
        if(!user_id){
            return res.status(401).json({message: "You haven't logged in yet"})
        }
        const addressList = await addressModel.getAddressList(user_id)
        return res.status(200).json(addressList)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Failed to load address list'})
    }

}
module.exports = {
    getProvince,
    getWardByProvince,
    addNewAddress,
    editAddress,
    delAddress,
    getAddressList
}