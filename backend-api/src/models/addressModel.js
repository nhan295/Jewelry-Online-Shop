const db = require('../config/db')

const AddressModel = {

    getProvince: ()=>{
        return db('province')
        .select('province.province_name','province.province_id')

    },
    
    getWardByProvince: (province_id)=>{
        return db('ward')
        .select('ward.ward_name','ward.ward_id')
        .innerJoin('province','ward.province_id','province.province_id')
        .where('province.province_id',province_id)
    },

    addNewAddress: (user_id,record_username,record_mobile,province_id,ward_id,street_address,address_type)=>{
        return db('user_record')
        .insert({
            user_id: user_id,
            record_username: record_username,
            record_mobile: record_mobile,
            province_id: province_id,
            ward_id: ward_id,
            street_address: street_address,
            address_type: address_type
        });
    },

    editAddress: (user_id,record_id,data)=>{
        return db('user_record')
        .update(data)
        .where({ user_id: user_id, record_id: record_id })
    },

    delAddress: (record_id,user_id)=>{
        return db('user_record')
        .where({ user_id: user_id, record_id: record_id })
        .del()
        
    },

    getAddressList: (user_id)=>{
        return db('user_record')
        .select('user_record.user_id',
                'user_record.record_username',
                'user_record.record_mobile',
                'user_record.street_address',
                'province.province_name',
                'ward.ward_name',
                'user_record.address_type')
        .innerJoin('province','province.province_id','user_record.province_id')
        .innerJoin('ward','ward.ward_id','user_record.ward_id')
        .where({user_id: user_id})
    }

}
module.exports = AddressModel