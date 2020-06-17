const mongoose = require('mongoose');


const collectionSchema = mongoose.Schema({
    
    
    id: Number,
    title: String,
    description: String,
    subject: String,
    format: String,
    source: String,
    rights: String,
    creator: String,
    date: String,
    cover_item: String


}, {timestamps:true} );


const Collection = mongoose.model('Collection', collectionSchema);

module.exports = { Collection }