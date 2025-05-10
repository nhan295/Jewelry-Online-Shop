const jewelryModel = require('../models/jewelryModel')

const getJewByCategory = async(req,res) =>{
    const{sub_category} = req.params; //lay gia tri tu tham so url
    const jewShow = await jewelryModel.getJewByCategory(sub_category)

    if(jewShow){
        res.json({message: jewShow})
    }
};

const getJewById = async(req,res)=>{
    const{jewelry_id} = req.params;
    const detail = await jewelryModel.getJewById(jewelry_id)

    if(detail){
        res.json({message: detail})
    }
};

const searchJewByName = async(req,res) =>{
    try{
        const name = req.params.name;
        const jewelry = await jewelryModel.searchJewByName(name)
        res.json({jewelry})
    }
    catch(err){
        res.status(500).json({message:'Error finding products'})
    }
}





module.exports = {
    getJewByCategory,
    getJewById,
    searchJewByName
}
