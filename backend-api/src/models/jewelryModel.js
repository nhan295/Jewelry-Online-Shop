const db = require('../config/db')

const jewveryModel = {

    getJewByCategory: (sub_category) => {
    return db('jewelry')
        .select('jewelry.jewelry_name',
                'jewelry.jewelry_price', 
                'color_code.color_name')
        .innerJoin('sub_catagories', 'sub_catagories.sub_id', 'jewelry.sub_id')
        .innerJoin('color_code', 'color_code.color_id', 'jewelry.color_id')
        .where('sub_catagories.sub_name', `${sub_category}`);
},

    getJewById: (jewelry_id) =>{
        return db('jewelry')
        .select('jewelry.jewelry_name',
                'jewelry.jewelry_img',
                'size.size_number',
                'size.quantity')
        .innerJoin('size','jewelry.jewelry_id','size.jewelry_id')
        .where('jewelry.jewelry_id', `${jewelry_id}`)
        

},
    searchJewByName: (name) =>{
        return db('jewelry')
         .select('jewelry.jewelry_name',
                'jewelry.jewelry_price', 
                'color_code.color_name')
        .innerJoin('sub_catagories', 'sub_catagories.sub_id', 'jewelry.sub_id')
        .innerJoin('color_code', 'color_code.color_id', 'jewelry.color_id')
        .where('jewelry.jewelry_name' `${name}`)
        .limit(4)
    }

}

module.exports = jewveryModel