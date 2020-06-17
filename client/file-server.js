var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
const mkdirp = require('mkdirp')
var bodyParser = require('body-parser');

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







// post file
app.post(
    '/upload/:id',
    function(req, res) {
        
        itemId = req.params.id;
        console.log(req.file);
        let index = 0;
     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                var dest = `public/images/items/${itemId}/original`;
                // fs.mkdirSync(dest, { recursive: true })
                mkdirp.sync(dest);
                cb(null, dest)
                
            },
            filename: function (req, file, cb) {
                // cb(null, Date.now() + '-' +file.originalname )
                cb(null, `${index}.jpg` );
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

const port = 8000;

app.listen(port, function() {

    console.log(`FILE-SERVER RUNNING : port ${port}`);

});