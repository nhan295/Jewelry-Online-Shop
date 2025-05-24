const db = require("../config/db");

const cartModel = {
  getCartData: (user_id) => {
    return db("cart")
    .select(
        'jewelry.jewelry_name',
        'color_code.color_name',
        'size.size_number',
        'cart.quantity',
        'jewelry_img.image'
    )
    .leftJoin("jewelry", "cart.jewelry_id", "jewelry.jewelry_id")
    .leftJoin("color_code", "cart.color_id", "color_code.color_id")
    .leftJoin("size", "cart.size_id", "size.size_id")
    .leftJoin("jewelry_img",function(){
        this.on('jewelry_img.jewelry_id','=','jewelry.jewelry_id')
            .andOn('jewelry_img.color_id','=','color_code.color_id')
      })
    .where({ user_id: user_id });

    
  },

  getCartItem: (user_id, jewelry_id, color_id, size_id) => {
    // lưu cart có sẵn trong Cart
    return db("cart")
      .where({
        user_id: user_id,
        jewelry_id: jewelry_id,
        color_id: color_id,
        size_id: size_id,
      })
      .first(); //trả về 1 object thay vì 1 mảng
  },

  addCart: async(user_id,jewelry_id,color_id,size_id,quantity)=>{   //neu da co size,color,jewelry_id thì tạo bản ghi mới
        const existingItem = await cartModel.getCartItem(user_id,jewelry_id,color_id,size_id)
        if(existingItem){
            return cartModel.updateCartQuantity(user_id,jewelry_id,size_id,color_id,quantity)
        }else{
            return db('cart')
            .insert({
                user_id: user_id,
                jewelry_id: jewelry_id,
                color_id: color_id,
                size_id: size_id,
                quantity: quantity
            })
        }
    },

    updateCartQuantity: async(user_id,jewelry_id,size_id,color_id,add_quantity)=>{
        const existingItem = await cartModel.getCartItem(user_id,jewelry_id,color_id,size_id)
        if(!existingItem){
            throw new Error ('Can found item in cart')
        }
        const newQuantity = add_quantity + existingItem.quantity
        return db('cart')
        .update({
            quantity: newQuantity                                                                                               
        })
        .where({jewelry_id: jewelry_id,
                user_id: user_id,
                size_id: size_id,
                color_id: color_id
        })
    },

      updateCart: async(user_id,jewelry_id,old_color,old_size,new_color,new_size,quantity) =>{
        return db('cart')
            .update({
                color_id: new_color,
                size_id: new_size,
                quantity: quantity,

            })
            .where({jewelry_id: jewelry_id,
                    user_id: user_id,
                    color_id: old_color,
                    size_id: old_size
            })
    },


  deleteCartItem: (user_id, jewelry_id, color_id, size_id) => {
    return db("cart")
      .del()
      .where({
        user_id: user_id,
        jewelry_id: jewelry_id,
        color_id: color_id,
        size_id: size_id,
      });
  },
};

module.exports = cartModel;

// cap nhat so luong
//cap nhat size
//cap nhat slg va size
// mau
