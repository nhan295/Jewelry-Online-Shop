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
    const rows = await jewelryModel.getJewById(jewelry_id,color_id)

    if(!rows || rows.length === 0){
        return res.status(404).json({message: 'Can not find product'})
    }
    const first = rows[0]  //dùng dữ liệu chung từ dòng đầu tiên

    const result  = {
        jewelry_name: first.jewelry_name,
        image: first.image,
        jewelry_price: first.jewelry_price,
        color_name: first.color_name,
        sizes: rows.map(row =>({
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


module.exports = {
    getJewBySubCategory,
    getJewByCategory,
    getJewById,
    searchJewByName
}
