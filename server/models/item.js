const mongoose = require('mongoose');


const itemSchema = mongoose.Schema({
    
    
    id: Number,
    title: String,
    creator: String,
    subject: String,
    location: String,
    description: String,
    source: String,
    date_created: String,
    tags: [
        {
            value: String,
            label: String
        }
    ],
    contributor: String,
    ownerId: {
        type:String
    },

    collection_id: Number,

    category_ref: [String],
    subcategory_ref: [String], 

    item_format: String,
    materials: String,
    physical_dimensions: String,
    pages: String,

    editor: String,
    publisher: String,
    further_info: String,


    external_link : [
        {
            url : String,
            text : String
         }
    ],

    is_link: Boolean,

    language: String,
    reference: String,
    rights: String,

    image: [
        {
            url: String,
            text: String
        }
    ],

    file_format: String,
    date_added: String,
    date_modified: String,
    number_files: Number,


    file_info: {
        file_url_original: String,
        file_url_fullsize: String,
        file_url_thumbnail: String,
        file_url_thumnail_sq: String,
        file_size: String,
        filename_orig: String,
        mime_type: String,
        file_added_date: String
    },
    omeka: {
        omeka_id: Number,
        omeka_collection_id: String,
        omeka_original : String,
        omeka_fullsize : String,
        omeka_thumbnail : String,
        omeka_thumbnail_sq : String,
        aws_filename: String
    },
    video: {
        vid_format: String,
        vid_bits_per_sample: String,
        vid_aspect_ratio: String,
        vid_res_x: String,
        vid_res_y: String,
        vid_comp_ratio: String
    },

    geo: {
        address: String,
        latitude: Number,
        longitude: Number
    },

    pdf_page_index: [
        {
            page: Number,
            heading: String,
            description: String
        }
    ],

    shareDisabled: Boolean

},{timestamps:true, strict: false});


const Item = mongoose.model('Item', itemSchema);

const PendingItem = mongoose.model('PendingItem', itemSchema);

module.exports = { Item, PendingItem }