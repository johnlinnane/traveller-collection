const mongoose = require('mongoose');


const cateogrySchema = mongoose.Schema({
    
    cat_id: Number,
    title: String,
    description: String,
    cover_item: Number

    // sub_cats: [{
    //     sub_id: Number,
    //     title: String
    // }],


}, {timestamps:true} );


const Cat = mongoose.model('Cat', cateogrySchema);

module.exports = { Cat }