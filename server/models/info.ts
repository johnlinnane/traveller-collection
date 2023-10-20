import mongoose from 'mongoose';

const infoSchema = new mongoose.Schema({
    sections : [{
        item_id : String,
        heading : String,
        paragraph : String
    }],
    iconsCaption: String
}, {timestamps:true} );

const Info = mongoose.model('Info', infoSchema);

module.exports = { Info }