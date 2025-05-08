const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getUserData = async(req, res) =>{
    try{
        const users = await userModel.getUserData();
    }
    catch (error){
        console.error(error)
        res.status(500).json({message: 'Error retrieving userdata'})
    }
}

const register = async(req,res) =>{
    try{
        const {username, email, address, password, confirmPass, date} = req.body
        if(!username || !email || !password || !confirmPass){
            return res.status(400).json({message:'Missing fiels'})
        }
        const existUsername = await userModel.getUserName(username);
        const existEmail = await userModel.getUserEmail(email);

        if(existEmail){
            return res.status(400).json({message:'Email arealdy exist'})
        }
        if(existUsername){
            return res.status(400).json({message:'Username arealdy exist'})
        }
        if(password !== confirmPass){
            return res.status(400).json({message:'Password do not matching'})
        }

        
        
        const hashedPassword = await bcrypt.hash(password,10);
        
        await userModel.register(username, email, hashedPassword, address, date);

        req.session.user = await userModel.getUserData(username);
        req.session.user_name =username

        res.status(200).json({message: req.session.user})

    }
    catch(error){
        console.error(error)
        res.status(500).json({message: 'Error register!!'})
    }
}
module.exports = {
    getUserData,
    register

}