import mongoose from 'mongoose';

const introSchema = new mongoose.Schema({
    title: String,
    body: String
}, {timestamps:true} );

const Intro = mongoose.model('Intro', introSchema);

module.exports = { Intro }