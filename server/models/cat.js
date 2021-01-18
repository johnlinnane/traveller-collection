const mongoose = require('mongoose');


const cateogrySchema = mongoose.Schema({
    
    title: String,
    description: String,
    catIsHidden: Boolean

}, {timestamps:true} );


const Cat = mongoose.model('Cat', cateogrySchema);

module.exports = { Cat }