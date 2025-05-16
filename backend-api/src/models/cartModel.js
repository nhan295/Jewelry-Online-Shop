const db = require('../config/db')

const cartModel = {
    getCartData: (user_id)=>{
        return db('cart').where({user_id:user_id})
    },

    getCartItem: (user_id,jewelry_id,color_id,size_id) =>{  // lưu cart có sẵn trong Cart
        return db('cart')
        .where({user_id:user_id,
                jewelry_id:jewelry_id,
                color_id: color_id,
                size_id: size_id})
    },

    addCart: async(user_id,jewelry_id,quantity,color_id,size_id)=>{   //neu da co size,color,jewelry_id thì tạo bản ghi mới
        const existingItem = await cartModel.getCartItem(user_id,jewelry_id)
        if(existingItem){
            return cartModel.updateCartQuantity(user_id,jewelry_id)
        }else{
            return db('cart')
            .insert({
                user_id: user_id,
                jewelry_id: jewelry_id,
                quantity: quantity,
                color_id: color_id,
                size_id: size_id
            })
        }
    },

    updateCartQuantity: async(user_id,jewelry_id,quantity)=>{
        const existingItem = await cartModel.getCartItem(user_id,jewelry_id)
        if(!existingItem){
            throw new Error ('Can found item in cart')
        }
        const newQuantity = quantity + existingItem.quantity
        return db('cart')
        .update({
            quantity: newQuantity
        })
        .where({jewelry_id: jewelry_id,
                user_id: user_id
        })
    },

    updateCart: (user_id,jewelry_id,size_id,color_id) =>{
        return db('cart')
            .update({
                quantity: quantity,
                jewelry_id: jewelry_id,
                color_id: color_id,
                size_id: size_id,
                user_id: user_id
            })
            .where({jewelry_id: jewelry_id,
                    user_id: user_id
            })
    },

    deleteCartItem: (user_id,jewelry_id)=>{
        return db('cart')
        .where({user_id: user_id,
                jewelry_id: jewelry_id
        })
    },
    
}

module.exports = cartModel

// cap nhat so luong
//cap nhat size 
//cap nhat slg va size
// mau