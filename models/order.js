const mongoose = require('mongoose');

/***************************************************
 * Schema is a layout how the data will be stored
*/
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: 1}
})

/***************************************************
 * First argument is the name of the model, second
 * is the schema that we want to use
*/
module.exports = mongoose.model('Order', orderSchema);
//further used in the product route