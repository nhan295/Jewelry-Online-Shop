const cartModel = require('../models/cartModel')


const getCartData = async(req,res) =>{
    try{
        const {user_id} = req.params
        if(!user_id){
            return res.status(400).json({message: 'You need to login to see cart'})
        }
        const cartItem = await cartModel.getCartData(user_id);

        if (!cartItem || cartItem.length===0){
            return res.status(404).json({message: 'Cart not found'})
        }
        return res.status(200).json({item: cartItem})
    }
    catch (error){
        console.error(error)
        return res.status(500).json({message: 'Error retrieving cart', error: error.message })
    }
};

const addCart = async (req, res) => {
  try {
    // lấy user từ session hoặc passport
    const user = req.user || req.session.user;

    if (!user) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const user_id = user.user_id; 
    const { jewelry_id, color_id, size_id, quantity } = req.body;

    const existCartItem = await cartModel.getCartItem(user_id, jewelry_id, color_id, size_id);

    if (existCartItem) {
      await cartModel.updateCartQuantity(user_id, jewelry_id, size_id, color_id, quantity);
      return res.status(200).json({ message: 'Updated quantity item!' });
    }

    await cartModel.addCart(user_id, jewelry_id, color_id, size_id, quantity);
    return res.status(200).json({ message: 'Add cart successfully!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error to add cart item', error: error.message });
  }
};

const deleteCartItem = async(req,res) =>{
    try{
        const {user_id,jewelry_id,color_id,size_id} = req.body
        const existCartItem = await cartModel.getCartItem(user_id,jewelry_id,color_id,size_id)
        if(existCartItem){
            await cartModel.deleteCartItem(user_id,jewelry_id,color_id,size_id);
            return res.status(200).json({message: 'Deleted cart item successfully'})
        }else{
            return res.status(400).json({message: 'Item not found'})
        } 
    }
    catch(error){
        return res.status(500).json({message: 'Error to delete cart item'})
    }
   
};

const updateCart = async(req, res) =>{
    try{
        const {user_id,jewelry_id,old_color,old_size,new_color,new_size,quantity} = req.body
        const existCartItem = await cartModel.getCartItem(user_id,jewelry_id,old_color,old_size)
        if(existCartItem){
            await cartModel.updateCart(user_id,jewelry_id,old_color,old_size,new_color,new_size,quantity)
            return res.status(200).json({message: 'Updated cart item'})
        }
        else{
            return res.status(400).json({message: 'Cart item not found'})
        }
    }
    catch(error){
        return res.status(500).json({message: 'Error to update cart item '})
    }
}

module.exports = {
    getCartData,
    addCart,
    deleteCartItem,
    updateCart
}