const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

//Shopping cart data model, refering to products id and owner id
const cartSchema = new Schema({
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var Carts = mongoose.model('Cart', cartSchema);

module.exports = Carts;