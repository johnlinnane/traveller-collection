const mongoose = require('mongoose');


const subcatSchema = mongoose.Schema({
    
    subcat_id: Number,
    title: String,
    description: String,
    parent_cat: Number,
    cover_item: Number


}, {timestamps:true} );


const SubCat = mongoose.model('SubCat', subcatSchema);

module.exports = { SubCat }