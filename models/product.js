const mongoose = require('mongoose');

/***************************************************
 * Schema is a layout how the data will be stored
*/
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: {type: Number, required: true}
})

/***************************************************
 * First argument is the name of the model, second
 * is the schema that we want to use
*/
module.exports = mongoose.model('Product', productSchema);
//further used in the product route