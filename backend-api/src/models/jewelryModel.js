const db = require('../config/db')

const jewveryModel = {

    getJewByCategory: (category) =>{ //Loc chi muc con thuoc categories
        return db('categories')
        .select('sub_categories.sub_name','sub_categories.sub_id')
        .innerJoin('sub_categories','sub_categories.categories_id','categories.categories_id')
        .where('categories.categories_name',`${category}`)
    },

    getJewBySubCategory: (sub_id) => { // Loc san pham tu sub_categories
    return db('jewelry')
        .select('jewelry.jewelry_name',
                'sub_categories.sub_name',
                'jewelry.jewelry_price', 
                'jewelry.jewelry_img',
                'color_code.color_name')
        .innerJoin('sub_categories', 'sub_categories.sub_id', 'jewelry.sub_id')
        .innerJoin('color_code', 'color_code.color_id', 'jewelry.color_id')
        .where('sub_categories.sub_id', `${sub_id}`);
},

    getJewById: (jewelry_id) =>{    // Xem chi tiet san pham
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
        .innerJoin('sub_categories', 'sub_categories.sub_id', 'jewelry.sub_id')
        .innerJoin('color_code', 'color_code.color_id', 'jewelry.color_id')
        .where('jewelry.jewelry_name',`${name}`)
        .limit(4)
    }

}

module.exports = jewveryModel