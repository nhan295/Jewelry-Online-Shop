const db = require('../config/db');

const userModel = {

   getUserById: (user_id) => {
    return db('users')
        .select('user_id', 'user_name', 'user_email', 'user_mobile', 'user_address', 'date_created')
        .where({ user_id })
        .first();
},
    getUserByUsername: (username) => {
        return db('users').where({ user_name: username }).first();
    },

    getUserEmail : (email) =>{
        return db('users').where({user_email: email}).first();
    },

    getUserAddress : (address) =>{
        return db('users').where({user_address: address}).first();
    },


    getUserPass : (username)=>{
        return db('users')
        .select('user_password')
        .where({user_name: username})
        .first()
        .then (result => result.user_password);
    },

    register: (username, email, password, address, date) =>{
        return db('users').insert({
            user_name: username,
            user_email: email,
            user_password: password,
            user_address: address,
            date_created: date
        })
    },

    login: (username,password) =>{
        return db('users').where({user_name: username})
    },

    changePassword: (userId, newPassword)=>{
        return db('users')
        .update({user_password: newPassword})
        .where({user_id: userId})
    },

    passwordByUserId: (userId) =>{
        return db('users')
        .select('user_password')
        .where({ user_id: userId })
        .then(result => result.user_password)
    },

    editProfile: (user_id,data) =>{
        return db('users')
        .update(data)
        .where({user_id: user_id})
    }


}

module.exports = userModel