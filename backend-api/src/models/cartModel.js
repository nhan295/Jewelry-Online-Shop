const db = require("../config/db");

const cartModel = {
  getCartData: (user_id) => {
    return db("cart").where({ user_id: user_id });
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

  addCart: async (user_id, jewelry_id, color_id, size_id, quantity,img_id) => {
    const existingItem = await cartModel.getCartItem(
      user_id,
      jewelry_id,
      color_id,
      size_id
    );

    if (existingItem) {
      await cartModel.updateCartQuantity(
        user_id,
        jewelry_id,
        size_id,
        color_id,
        quantity
      );
    } else {
      await db("cart").insert({
        user_id,
        jewelry_id,
        color_id,
        size_id,
        quantity
      });
    }

    // Sau khi insert/update thì JOIN để lấy tên
    const item = await db("cart")
      .select(
        "cart.user_id",
        "cart.jewelry_id",
        "jewelry.jewelry_name as jewelry_name",
        "cart.color_id",
        "color_code.color_name as color_name",
        "cart.size_id",
        "size.size_number as size_number",
        "cart.quantity",
        "jewelry_img.image as image"
      )
      .leftJoin("jewelry", "cart.jewelry_id", "jewelry.jewelry_id")
      .leftJoin("color_code", "cart.color_id", "color_code.color_id")
      .leftJoin("size", "cart.size_id", "size.size_id")
      .leftJoin("jewelry_img",function(){
        this.on('jewelry_img.jewelry_id','=','jewelry.jewelry_id')
            .andOn('jewelry_img.color_id','=','color_code.color_id')
      })
      .where({
        "cart.user_id": user_id,
        "cart.jewelry_id": jewelry_id,
        "cart.color_id": color_id,
        "cart.size_id": size_id
      })
      .first();
      

    return item;
  },

  updateCartQuantity: async (
    user_id,
    jewelry_id,
    size_id,
    color_id,
    add_quantity
  ) => {
    const existingItem = await cartModel.getCartItem(
      user_id,
      jewelry_id,
      color_id,
      size_id
    );
    if (!existingItem) {
      throw new Error("Can found item in cart");
    }
    const newQuantity = add_quantity + existingItem.quantity;
    return db("cart")
      .update({
        quantity: newQuantity,
      })
      .where({
        jewelry_id: jewelry_id,
        user_id: user_id,
        size_id: size_id,
        color_id: color_id,
      });
  },

  updateCart: async (
    user_id,
    jewelry_id,
    old_color,
    old_size,
    new_color,
    new_size,
    quantity
  ) => {
    return db("cart")
      .update({
        color_id: new_color,
        size_id: new_size,
        quantity: quantity,
      })
      .where({
        jewelry_id: jewelry_id,
        user_id: user_id,
        color_id: old_color,
        size_id: old_size,
      });
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
