const mongoose = require('mongoose');


const subcatSchema = mongoose.Schema({
    
    title: String,
    description: String,
    parent_cat: String,
    cover_item: Number,
    subCatIsHidden: Boolean


}, {timestamps:true} );


const SubCat = mongoose.model('SubCat', subcatSchema);

module.exports = { SubCat }