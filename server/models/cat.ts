import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    title: String,
    description: String,
    catIsHidden: Boolean
}, {timestamps:true} );

const Cat = mongoose.model('Cat', categorySchema);

module.exports = { Cat }