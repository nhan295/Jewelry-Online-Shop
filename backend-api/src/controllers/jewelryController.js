const jewelryModel = require('../models/jewelryModel')

const getJewBySubCategory = async(req,res) =>{
    const{sub_id} = req.params; //lay gia tri tu tham so url
    const jewShow = await jewelryModel.getJewBySubCategory(sub_id)

    if(jewShow){
        res.json({message: jewShow})
    }
};

const getSubCateByCategory = async(req,res) =>{
    const{category} = req.params; //lay gia tri tu tham so url
    const jewShow = await jewelryModel.getSubCateByCategory(category)

    if(jewShow){
        res.json({message: jewShow})
    }
};

const getJewById = async(req,res)=>{   // trả về sp ứng màu dã được chọn
    const{jewelry_id,color_id} = req.params;
    const rows = await jewelryModel.getJewById(jewelry_id,color_id)

    if(!rows || rows.length === 0){
        return res.status(404).json({message: 'Can not find product'})
    }
    const first = rows[0]  //dùng dữ liệu chung từ dòng đầu tiên

    const result  = {
        jewelry_name: first.jewelry_name,
        img_id: first.img_id,
        image: first.image,
        jewelry_price: first.jewelry_price,
        color_name: first.color_name,
        sizes: rows.map(row =>({
            size_id: row.size_id,
            size_number: row.size_number,
            quantity: row.quantity
        }))
        
    }
    res.json({message: result})  //trả về 1 object
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

const getAllJew = async(req,res) =>{
    try{
        const jewelry = await jewelryModel.getAllJew();
        res.json({message: jewelry})
    }
    catch(err){
        res.status(500).json({message:'Error finding products'})
    }
}

const getJewByCategoryName = async(req,res)=> {
    const {categoryName} = req.params
    const jewelry = await jewelryModel.getJewByCategoryName(categoryName)
    if(jewelry){
        res.json({message: jewelry})
    }
}

module.exports = {
    getJewBySubCategory,
    getSubCateByCategory,
    getJewById,
    searchJewByName,
    getAllJew,
    getJewByCategoryName
}
