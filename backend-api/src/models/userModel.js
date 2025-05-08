const db = require('../config/db');

const userModel = {

    getUserData : (username) =>{
        return db('user').select('*').where({user_name : username}).first();
    },

    getUserName : (username) =>{
        return db('user').where({user_name: username}).first();
    },

    getUserEmail : (email) =>{
        return db('user').where({user_email: emal}).first();
    },

    getUserAddress : (address) =>{
        return db('user').where({user_address: address}).first();
    },


    getUserPass : (username)=>{
        return db('user')
        .select('user_password')
        .where({user_name: username})
        .first()
        .then (result => result.user_password);
    },

    register: (username, email, password, address, date) =>{
        return db('user').insert({
            user_name: username,
            user_email: email,
            user_password: password,
            user_address: address,
            date_created: date
        })
    },

    login: (username) =>{
        return db('user').where({user_name: username})
    },

    changePassword: (userId, newPassword)=>{
        return db('user')
        .update({user_password: newPassword})
        .where({user_id: userId})
    },

    passwordByUserId: (userId) =>{
        return db('user')
        .select('user_password')
        .where({ user_id: userId })
        .then(result => result.user_password)
    }


}

module.export = userModel