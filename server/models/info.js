const mongoose = require('mongoose');


const infoSchema = mongoose.Schema({
    
    heading_1: String,
    heading_2: String,
    heading_3: String,
    heading_4: String,
    paragraph_1: String,
    paragraph_2: String,
    paragraph_3: String,
    paragraph_4: String


}, {timestamps:true} );


const Info = mongoose.model('Info', infoSchema);

module.exports = { Info }