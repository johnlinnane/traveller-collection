const mongoose = require('mongoose');


const infoSchema = mongoose.Schema({
    

    sections : [
        {
            heading : String,
            paragraph : String
         }
    ]

}, {timestamps:true} );


const Info = mongoose.model('Info', infoSchema);

module.exports = { Info }