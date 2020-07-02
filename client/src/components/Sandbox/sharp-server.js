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







// // post file
// app.post(
//     '/upload/:id',
//     function(req, res) {
        
//         itemId = req.params.id;
//         console.log(req.file);
//         let index = 0;
     
//         multer({ storage: multer.diskStorage({
//             destination: function (req, file, cb) {

//                 var dest = `./public/images/items/${itemId}/original`;
//                 // fs.mkdirSync(dest, { recursive: true })
//                 mkdirp.sync(dest);
//                 cb(null, dest)
                
//             },
//             filename: function (req, file, cb) {
//                 // cb(null, Date.now() + '-' +file.originalname )
//                 cb(null, `${index}.jpg` );
//                 index++;
//             }
//         }) }).array('file')(req, res, function (err) {
            
//             if (err instanceof multer.MulterError) {
//                 return res.status(500).json(err)
//             } else if (err) {
//                 return res.status(500).json(err)
//             }

//         return res.status(200).send(req.file)
//     })

// });


// // change category cover image
// app.post(
//     '/upload-cat/:id',
//     function(req, res) {
        
//         let catId = req.params.id;
//         console.log(req.file);
//         let index = 0;
     
//         multer({ storage: multer.diskStorage({
//             destination: function (req, file, cb) {

//                 var dest = `./public/images/cover_img_cat`;
//                 // var dest = `./public/images/upload_test`;
//                 // fs.mkdirSync(dest, { recursive: true })
//                 mkdirp.sync(dest);
//                 cb(null, dest)
                
//             },
//             filename: function (req, file, cb) {
//                 // cb(null, Date.now() + '-' +file.originalname )
//                 cb(null, `${catId}.jpg` );
//                 index++;
//             }
//         }) }).array('file')(req, res, function (err) {
            
//             if (err instanceof multer.MulterError) {
//                 return res.status(500).json(err) 
//             } else if (err) {
//                 return res.status(500).json(err)
//             }

//         return res.status(200).send(req.file)
//     })

// });



// SHARP TEST !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {

//         var dest = `./public/images/cover_img_cat`;
//         // var dest = `./public/images/upload_test`;
//         // fs.mkdirSync(dest, { recursive: true })
//         mkdirp.sync(dest);
//         cb(null, dest)
        
//     },
//     filename: function (req, file, cb) {
//         // cb(null, Date.now() + '-' +file.originalname )
//         cb(null, `${catId}.jpg` );
//         index++;
//     }
// })



// var upload = multer ({storage: storage}).single('file')


app.post(
    '/upload-sharp', 
    multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
        
                var dest = `./sharp-dump`;
                // var dest = `./public/images/upload_test`;
                // fs.mkdirSync(dest, { recursive: true })
                mkdirp.sync(dest);
                cb(null, dest)
                
            },
            filename: function (req, file, cb) {
                // cb(null, Date.now() + '-' +file.originalname )
                cb(null, `test_img.jpg` );
            }
        })
    })
        .single('file'), function(req, res, next) {
            sharp.cache({files: 0});

            console.log(req.file);

            let width = 500;
            let height = 500;
            var dest = './sharp-dump/thumb';
            mkdirp.sync(dest);

            sharp(req.file.path)
                .resize(width, height)
                // .toFile('public/uploads/thumb/thumb_' + req.file.originalname, function(err) {

                // .toFile('./sharp-dump/thumb/thumb_test_img.jpg', function(err) {

                


                .toFile(dest + '/thumb_test_img.jpg', function(err) {
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


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!







const port = 4500;

app.listen(port, function() {

    console.log(`FILE-SERVER RUNNING : port ${port}`);

});

