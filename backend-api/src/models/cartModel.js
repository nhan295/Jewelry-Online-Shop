const db = require('../config/db')

const cartModel = {
    getCartData: (user_id)=>{
        return db('cart').where({user_id:user_id})
    },

    getCartItem: (user_id,jewelry_id) =>{  // lưu cart có sẵn trong Cart
        return db('cart')
        .select('jewelry.jewelry_name',
                'jewelry.jewelry_price',
                'jewelry.jewelry_img',
                'color_code.color_name',
                'cart.quantity')
        .where({user_id:user_id, jewelry_id:jewelry_id})
    },

    addCart: async(user_id,jewelry_id,quantity,color_id)=>{
        const existingItem = await cartModel.updateCartQuantity(user_id,jewelry_id)
        if(existingItem){
            return cartModel.updateCart(user_id,jewelry_id)
        }else{
            return db('cart')
            .insert({
                user_id: user_id,
                jewelry_id: jewelry_id,
                quantity: quantity,
                color_id: color_id
            })
        }
    },

    updateCart: (user_id,jewelry_id,quantity) =>{
        return db('cart')
        .update({quantity: quantity})
        .where({jewelry_id:jewelry_id,
                user_id: user_id
        })

    },

    updateCartQuantity: async(user_id,jewelry_id,quantity)=>{
        const existingItem = await cartModel.getCartItem(user_id,jewelry_id)
        if(!existingItem){
            throw new Error ('Can  found item in cart')
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

    deleteCartItem: (user_id,jewelry_id)=>{
        return db('cart')
        .where({user_id: user_id,
            jewelry_id: jewelry_id
        })
    },
    
}

module.exports = cartModel