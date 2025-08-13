const db = require('../config/db')

const jewelryModel = {

    getSubCateByCategory: (category) =>{ //Loc chi muc con thuoc categories
        return db('categories')
        .select('sub_categories.sub_name','sub_categories.sub_id')
        .innerJoin('sub_categories','sub_categories.categories_id','categories.categories_id')
        .where('categories.categories_name',`${category}`)
    },

    getJewBySubCategory: (sub_id) => { // Loc san pham tu sub_categories
    return db('jewelry')
        .select('jewelry.jewelry_name',
                'jewelry.jewelry_id',
                'sub_categories.sub_name',
                'jewelry.jewelry_price', 
                db.raw(`CONCAT('../../assets/image/', jewelry_img.image) as image`),
                'jewelry_img.img_id',
                'color_code.color_name',
                'color_code.color_id')
        .innerJoin('sub_categories', 'sub_categories.sub_id', 'jewelry.sub_id')
        .innerJoin('color_code', 'color_code.jewelry_id', 'jewelry.jewelry_id')
        .leftJoin('jewelry_img',function(){
            this.on('jewelry_img.jewelry_id','=','jewelry.jewelry_id')
            .andOn('jewelry_img.color_id','=','color_code.color_id')
        })
        .where('sub_categories.sub_id', `${sub_id}`)
        .groupBy('jewelry.jewelry_id', 'sub_categories.sub_name','color_code.color_id');
},

    getJewById: (jewelry_id,color_id) =>{    // Xem chi tiet san pham
        return db('jewelry')
        .select('jewelry.jewelry_name',
                'jewelry.jewelry_id',
                db.raw(`CONCAT('../../assets/image/', jewelry_img.image) as image`),
                'jewelry_img.img_id',
                'jewelry.jewelry_price',
                'color_code.color_name',
                'size_id',
                'size.size_number',
                'size.quantity')
        .innerJoin('size','size.jewelry_id','jewelry.jewelry_id')  
        .leftJoin('color_code',function(){
            this.on('color_code.jewelry_id','=','jewelry.jewelry_id')
            .andOn('color_code.color_id','=','size.color_id')
        })
        .leftJoin('jewelry_img',function(){
            this.on('jewelry_img.jewelry_id','=','jewelry.jewelry_id')
            .andOn('jewelry_img.color_id','=','color_code.color_id')
        })
       
        .where({'jewelry.jewelry_id':jewelry_id,
                'color_code.color_id':color_id
    });
        
},
    searchJewByName: (jewelry_name) =>{
        return db('jewelry')
         .select('jewelry.jewelry_name',
                'jewelry.jewelry_price', 
                'color_code.color_name',
                'size.size_number',
                db.raw(`CONCAT('../../assets/image/', jewelry_img.image) as image`),
            )
        .innerJoin('size','size.jewelry_id','jewelry.jewelry_id')
        .leftJoin('color_code',function(){
            this.on('color_code.jewelry_id','=','jewelry.jewelry_id')
            .andOn('color_code.color_id','=','size.color_id')
        })
        .leftJoin('jewelry_img',function(){
            this.on('jewelry_img.jewelry_id','=','jewelry.jewelry_id')
            .andOn('jewelry_img.color_id','=','color_code.color_id')
        })
        .where('jewelry_name','like',`%${jewelry_name}%`)
        .limit(4)
        .groupBy('jewelry.jewelry_id','color_code.color_id');
    },

    getAllJew: ()=>{
        return db('jewelry')
        .select('jewelry.jewelry_name',
                'jewelry.jewelry_id',
                'sub_categories.sub_name',
                'jewelry.jewelry_price', 
                 db.raw(`CONCAT('../../assets/image/', jewelry_img.image) as image`),
                'jewelry_img.img_id',
                'color_code.color_name',
                'color_code.color_id')
        .innerJoin('sub_categories', 'sub_categories.sub_id', 'jewelry.sub_id')
        .innerJoin('color_code', 'color_code.jewelry_id', 'jewelry.jewelry_id')
        .leftJoin('jewelry_img',function(){
            this.on('jewelry_img.jewelry_id','=','jewelry.jewelry_id')
            .andOn('jewelry_img.color_id','=','color_code.color_id')
        })
        .groupBy('jewelry.jewelry_id', 'sub_categories.sub_name','color_code.color_id')
        .limit(10);
    },

    getJewByCategoryName: (categoryName) => {
    return db('jewelry')
        .select(
            'jewelry.jewelry_name',
            'jewelry.jewelry_id',
            'sub_categories.sub_name',
            'jewelry.jewelry_price',
            db.raw(`CONCAT('../../assets/image/', jewelry_img.image) as image`),
            'jewelry_img.img_id',
            'color_code.color_name',
            'color_code.color_id',
            'categories.categories_name'
        )
        .innerJoin('sub_categories', 'sub_categories.sub_id', 'jewelry.sub_id')
        .innerJoin('categories', 'sub_categories.categories_id', 'categories.categories_id')
        .innerJoin('color_code', 'color_code.jewelry_id', 'jewelry.jewelry_id')
        .leftJoin('jewelry_img', function() {
            this.on('jewelry_img.jewelry_id', '=', 'jewelry.jewelry_id')
                .andOn('jewelry_img.color_id', '=', 'color_code.color_id');
        })
        .where('categories.categories_name', 'like', `%${categoryName}%`)
        .groupBy(
            'jewelry.jewelry_id',
            'sub_categories.sub_name',
            'color_code.color_id'
          
        );
}

}

module.exports = jewelryModel