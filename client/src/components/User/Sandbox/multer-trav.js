const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
import React from 'react';




const Sandbox = () => {
    // Set The Storage Engine
    const storage = multer.diskStorage({
        destination: './public/uploads/',
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    // Init Upload
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1000000
        },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).single('myImage');

    // Check File Type
    function checkFileType(file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }

    // Init app
    const app = express();

    // EJS
    app.set('view engine', 'ejs');

    // Public Folder
    app.use(express.static('./public'));

    app.get('/', (req, res) => res.render('index'));

    app.post('/upload', (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                res.render('index', {
                    msg: err
                });
            } else {
                if (req.file == undefined) {
                    res.render('index', {
                        msg: 'Error: No File Selected!'
                    });
                } else {
                    res.render('index', {
                        msg: 'File Uploaded!',
                        file: `uploads/${req.file.filename}`
                    });
                }
            }
        });
    });

    const port = 4000;

    app.listen(port, () => console.log(`Server started on port ${port}`));

    return ( <div class="container" >
        <h1 > File Upload </h1> { /* <%= typeof msg != 'undefined' ? msg : '' %> */ } 
        <
        form action = "/upload"
        method = "POST"
        enctype = "multipart/form-data" >
        <
        div class = "file-field input-field" >
        <
        div class = "btn grey" >
        <
        span > File < /span> <
        input name = "myImage"
        type = "file" / >
        <
        /div> <
        div class = "file-path-wrapper" >
        <
        input class = "file-path validate"
        type = "text" / >
        <
        /div> <
        /div> <
        button type = "submit"
        class = "btn" > Submit < /button> <
        /form> <
        br / >
        <
        img src = "<%= typeof file != 'undefined' ? file : '' %>"
        class = "responsive-img" > < /img> <
        /div>
    )


}

export default Sandbox;