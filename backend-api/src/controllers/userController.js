const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getUserData = (req, res) =>{
   if(!req.session.user){
    return res.status(401).json({message:'not authenticate'})
   }
   res.status(200).json({user: req.session.user})
}

const register = async(req,res) =>{
    try{
        const {username, email, password, address, confirmPass, date} = req.body
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

const login = async(req,res) =>{
    try{
        const {username,password} = req.body;
        const getUserName = await userModel.getUserName(username)

        if(!getUserName){
            return res.status(401).json({message:'username not exist'})
        }

        const getPassword = await userModel.getUserPass(username)
        const match = await bcrypt.compareSync(password, getPassword);
    

        if(!match){
            return res.status(401).json({message:'password does not match'})
        }
        else{
            req.session.user = await userModel.getUserData(username)  // session được lưu trữ trong req.session
            req.session.user_name = username
            res.status(200).json({message: req.session.user})
        }

    }
    catch(error){
        console.error(error)
        res.status(500).json({message: 'Error login!!'})
    }
}



const changePass = async(req, res)=>{
    const userId = req.session.user.user_id;
    const {currentPass,newPass,confirmPass} = req.body

    if(!currentPass || !newPass || !confirmPass){
        return res.status(401).json({message:'Missing fields'})
    }
    if(newPass !== currentPass){
        return res.status(401).json({message:'Password not match'})
    }

    const oldPass = await userModel.passwordByUserId(userId)
    const match = await bcrypt.compareSync(currentPass, oldPass)

    if(match){
        const newHashPass = await bcrypt.hash(newPass,10)
        await userModel.changePass(userId, newHashPass)
        res.status(200).json({message: 'Password changed'})
    }
    else{
        return res.status(401).json({message:'wrong current password'})
    }

}

const logout = async(req,res) =>{
    req.session.destroy((err) =>{
        if(err){
            console.error(err)
            return res.status(500).json({message:'error logout'})

        }
        res.clearCookie('connect.sid')
        res.status(200).json({message:'logged out'})
    })
}
module.exports = {
    getUserData,
    register,
    login,
    changePass,
    logout
}