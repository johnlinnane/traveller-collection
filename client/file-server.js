var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const mkdirp = require('mkdirp')
var bodyParser = require('body-parser');
const sharp = require('sharp');


app.use(cors())
app.use(bodyParser.json());

let itemId = null;
let index = 0;


// //create multer instance, for file saving
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/images/uploads')
//     },
//     filename: function (req, file, cb) {
    
//         cb(null, `${itemId}.jpg` )
//     }
// })
// var upload = multer({ storage: storage }).array('file')






// *********************** ITEM IMAGE/S ************************


app.post(
    '/upload/:id', 
    // function(req, res) {
        multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    itemId = req.params.id;
                    var dest = `./public/images/items/${itemId}/original`;
                    mkdirp.sync(dest);
                    cb(null, dest)
                },
                filename: function (req, file, cb) {
                    cb(null, `${index}.jpg` );
                    index++;
                }
            })
        })
        // .single('file'), function(req, res, next) {
        .array('file')
        , function(req, res, next) {
            itemId = req.params.id;
            // sharp.cache({files: 0});

            console.log(req.files[0].path);

            let width = 500;
            let height = 500;
            var dest = `./public/images/items/${itemId}/sq_thumbnail`;
            mkdirp.sync(dest);

            sharp(req.files[0].path)
                .resize(width, height)
                .toFile(`${dest}/0.jpg`, function(err) {
                    if(!err) {
                        console.log('sharp worked');
                        res.write("File uploaded successfully.");
                        res.end();
                    } else {
                        console.log(err);
                    }
                })
        }
    
)







// *********************** CATEGORY IMAGE ************************

app.post(
    '/upload-cat/:id',
    function(req, res) {
        
        let catId = req.params.id;
        console.log(req.file);
        let index = 0;
     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                var dest = `./public/images/cover_img_cat`;
                // var dest = `./public/images/upload_test`;
                // fs.mkdirSync(dest, { recursive: true })
                mkdirp.sync(dest);
                cb(null, dest)
                
            },
            filename: function (req, file, cb) {
                // cb(null, Date.now() + '-' +file.originalname )
                cb(null, `${catId}.jpg` );
                index++;
            }
        }) }).array('file')(req, res, function (err) {
            
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }

        return res.status(200).send(req.file)
    })

});


// *********************** INTRO IMAGE ************************

app.post(
    '/upload-intro-img',
    function(req, res) {
        
        console.log(req.file);

     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                var dest = `./public/images/intro`;
                // var dest = `./public/images/upload_test`;
                // fs.mkdirSync(dest, { recursive: true })
                mkdirp.sync(dest);
                cb(null, dest)
                
            },
            filename: function (req, file, cb) {
                cb(null, `intro.jpg` );
            }
        }) }).single('file')(req, res, function (err) {
            
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }

        return res.status(200).send(req.file)
    })

});

// *********************** INFORMATION IMAGE ************************

app.post(
    '/upload-info/:number',
    function(req, res) {
        
        let number = req.params.number;
        console.log(req.file);

     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                var dest = `./public/images/info`;
                mkdirp.sync(dest);
                cb(null, dest)
                
            },
            filename: function (req, file, cb) {
                cb(null, `${number}.jpg` );
            }
        }) }).single('file')(req, res, function (err) {
            
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }

        return res.status(200).send(req.file)
    })

});

// ***********************************************************************


const port = 8000;

app.listen(port, function() {

    console.log(`FILE-SERVER RUNNING : port ${port}`);

});


