const mongoose = require('mongoose');


const infoSchema = mongoose.Schema({
    
    
    paragraph_1: String,
    paragraph_2: String,
    paragraph_3: String,
    paragraph_4: String


}, {timestamps:true} );


const Info = mongoose.model('Info', introSchema);

module.exports = { Info }