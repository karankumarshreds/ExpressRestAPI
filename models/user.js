const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    password: {type: String, require: true},
    email: { type: String, require: true, unique: true}
});

module.exports = mongoose.model('User', userSchema);