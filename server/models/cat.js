const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title: String,
    description: String,
    catIsHidden: Boolean
}, {timestamps:true} );

const Cat = mongoose.model('Cat', categorySchema);

module.exports = { Cat }