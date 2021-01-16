const mongoose = require('mongoose');


const introSchema = mongoose.Schema({
    
    
    title: String,
    body: String


}, {timestamps:true} );


const Intro = mongoose.model('Intro', introSchema);

module.exports = { Intro }