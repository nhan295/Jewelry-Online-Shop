const jewelryModel = require('../models/jewelryModel')

const getJewBySubCategory = async(req,res) =>{
    const{sub_id} = req.params; //lay gia tri tu tham so url
    const jewShow = await jewelryModel.getJewBySubCategory(sub_id)

    if(jewShow){
        res.json({message: jewShow})
    }
};

const getJewByCategory = async(req,res) =>{
    const{category} = req.params; //lay gia tri tu tham so url
    const jewShow = await jewelryModel.getJewByCategory(category)

    if(jewShow){
        res.json({message: jewShow})
    }
};

const getJewById = async(req,res)=>{   // trả về sp ứng màu dã được chọn
    const{jewelry_id,color_id} = req.params;
    const detail = await jewelryModel.getJewById(jewelry_id,color_id)

    if(detail){
        res.json({message: detail})
    }
};

const searchJewByName = async(req,res) =>{
    try{
        const jewelry_name = req.params.jewelry_name;
        const jewelry = await jewelryModel.searchJewByName(jewelry_name)
        res.json({jewelry})
    }
    catch(err){
        res.status(500).json({message:'Error finding products'})
    }
}


module.exports = {
    getJewBySubCategory,
    getJewByCategory,
    getJewById,
    searchJewByName
}
