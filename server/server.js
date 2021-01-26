const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require("path")
const sharp = require('sharp');


const app = express();

require('dotenv').config({path: '../.env'})

// file upload
const cors = require('cors');
const multer = require('multer');
const fs = require('fs')
const mkdirp = require('mkdirp')


// connect to mongo
mongoose.Promise = global.Promise;

mongoose.connect(process.env.REACT_APP_DB, { useNewUrlParser: true })
    .catch(error => console.log('MONGOOSE CONNECT ERROR: ', error));



// bring in mongo model
const { User } = require('./models/user');
const { Item, PendingItem } = require('./models/item');

const { Cat } = require('./models/cat');
const { SubCat } = require('./models/subcat');
const { Intro } = require('./models/intro');
const { Info } = require('./models/info');



const { authMiddleware } = require('./middleware/auth_middleware');
const { fileURLToPath } = require('url');


// set middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
    // origin: "*" // wildcard does not work with post
}));



// *************************************************************
// **************************** GET ****************************
// *************************************************************



// deny access
app.get('/api/auth-get-user-creds', authMiddleware, (req, res) => {
    console.log('API/AUTH-GET-USER-CREDS FIRED')
    // console.log('API/AUTH-GET-USER-CREDS REQ', req)
    res.json({
        isAuth:true,
        id:req.user._id,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname
    })
})



// check if user is logged in, auth is middleware
app.get('/api/logout', authMiddleware, (req, res) => {
    //delete user's cookie info in the db
    req.user.deleteToken(req.token, (err, user) => {
        if(err) return res.status(400).send(err);
        res.sendStatus(200)
    })

}) 




// * * * * * * * * * * * * * * * * * * * * getItemById
app.get('/api/get-item-by-id', (req,res) => {
    let id = req.query.id;
    Item.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


//////// * * * * * * * * * * * * * * * * * * * * getPendItemById
app.get('/api/get-pend-item-by-id', (req,res) => {
    let id = req.query.id;
    PendingItem.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})

// * * * * * * * * * * * * * * * * * * * * getParentPdf
app.get('/api/get-parent-pdf', (req,res) => {
    let id = req.query.id;
    Item.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * searchItem // unused???
app.get('/api/search-item', (req,res) => {
    let queryKey = req.query.key;
    let queryValue = req.query.value;

    let query = {};
    query[queryKey] = queryValue;

    Item.find( query , (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



// * * * * * * * * * * * * * * * * * * * * get all items TEST
app.get('/api/allItems', (req, res) => {
    // empty object returns all
    Item.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})


/////////////////// get all pend items
app.get('/api/all-pend-items', (req, res) => {
    // empty object returns all
    PendingItem.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})







// * * * * * * * * * * * * * * * * * * * * get multiple items
app.get('/api/items', (req,res) => {
    // query should look like this: localhost:3002/api/items?skip=3?limit=2&order=asc
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;

    Item.find().skip(skip).sort({_id:order}).limit(limit).exec((err,doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})









// * * * * * * * * * * * * * * * * * * * * get contributor by id
app.get('/api/get-contributor', (req, res) => {
    let id = req.query.id;

    User.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            name:doc.name,
            lastname:doc.lastname
        })
    })
})


// get users
app.get('/api/users', (req, res) => {
    // empty object returns all
    User.find({}, (err, users) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(users);
    })
})



app.get('/api/user-items', (req, res) => {
    Item.find({ownerId:req.query.user}).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})








// * * * * * * * * * * * * * * * * * * * * get all categories

app.get('/api/get-all-categories', (req, res) => {
    Cat.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})



// * * * * * * * * * * * * * * * * * * * * get all sub-categories

app.get('/api/get-all-subcategories', (req, res) => {
    SubCat.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})




// * * * * * * * * * * * * * * * * * * * * get item by category


app.get('/api/get-items-by-cat', (req, res) => {

    let value = req.query.value;
    console.log('GETITEMSBYCAT VALUE', value);
  
    Item.find({ category_ref:value }).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})



// * * * * * * * * * * * * * * * * * * * * getNextItem
app.get('/api/get-next-item', (req,res) => {
    let oldId = req.query.oldId;
    let query = {_id: {$gt: oldId}}
    Item.findOne(query, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * getPrevItem
app.get('/api/get-prev-item', (req,res) => {
    let oldId = req.query.oldId;
    // let query = {_id: {$lt: oldId}}, null, { sort: { '_id':-1 } };
    Item.findOne({_id: {$lt: oldId}}, null, { sort: { '_id':-1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * get latest item
app.get('/api/get-latest-item', (req,res) => {

    Item.findOne({}, {}, { sort: { '_id':-1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



// * * * * * * * * * * * * * * * * * * * * get subcat info 
// * * * * * * * * * * * * * * * * * * * * not used?? replaced by get-subcat-by-id??? 
app.get('/api/get-subcat', (req,res) => {
    let subcatId = req.query.subcatid;

    SubCat.findOne({ _id: subcatId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * get items by subcat
app.get('/api/get-items-by-subcat', (req,res) => {
    let subcatId = req.query.subcatid;

    Item.find({ subcategory_ref: subcatId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



// not used
// * * * * * * * * * * * * * * * * * * * * get first item by subcat and cat
app.get('/api/get-first-item-by-subcat', (req,res) => {
    let catId = req.query.catid;
    let subcatId = req.query.subcatid;

    Item.findOne({category_ref: catId, subcategory_ref: subcatId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})

// * * * * * * * * * * * * * * * * * * * * get subcats by cat
app.get('/api/get-subcat-by-cat', (req,res) => {
    let catId = req.query.catid;

    SubCat.find({ parent_cat: catId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * GET CAT / SUBCAT / COLL BY ID!


app.get('/api/get-cat-by-id', (req, res) => {
    let value = req.query.id;
  
    Cat.findOne({ _id:value }).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})


app.get('/api/get-subcat-by-id', (req, res) => {
    let value = req.query.id;
  
    SubCat.find({ _id:value }).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})

// ******************** get intro text

app.get('/api/get-intro-text', (req,res) => {

    Intro.findOne({}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


//  ******************** get info text

app.get('/api/get-info-text', (req,res) => {
    Info.findOne({}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



//  ******************** get documents with coordinates

app.get('/api/get-items-with-coords', (req,res) => {
    // console.log('getItemsWithCoords called')
    Item.find( { "geo.latitude": {$ne:null} }, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})





// *******************************************************
// ********************* POST ****************************
// *******************************************************



// * * * * * * * * * * * * * * * * * * * * post new item
app.post('/api/create-item', (req, res) => {
    const item = new Item( req.body );             // req is the data you post

    item.save( (err, doc) =>{                      // saves the new document
        // console.log(doc._id);
        if(err) return res.status(400).send(doc);
        res.status(200).json({
            post:true,
            itemId:doc._id                       // gets the id from the post
        })
      })
})



//////////// * * * * * * * * * * * post pending item
app.post('/api/create-item-pending', (req, res) => {
    const pendingItem = new PendingItem( req.body );             // req is the data you post
    console.log('ITEM-PENDING REQ.BODY: ', req.body);

    pendingItem.save( (err, doc) =>{                      // saves the new document
        console.log('PENDING ITEM BEING SAVED: ', doc);
        if(err) return res.status(400).send(doc);
        res.status(200).json({
            post:true,
            itemId:doc._id                       // gets the id from the post
        })
      })
})


// register user
app.post('/api/register', (req, res) => {
    // create new user document (user)
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({success:false});
        res.status(200).json({
            success:true,
            user:doc
        })
    })
})


// create the login
app.post('/api/login', (req, res) => {
    User.findOne({'email':req.body.email}, (err, user) => {
        
        if(!user) {
            return res.json({isAuth:false, message:'Auth failed, email not found'})
        };

        user.comparePassword(req.body.password, (err, isMatch) => {
            

            if(!isMatch) {
                return res.json({
                    isAuth:false,
                    message:'Wrong password'
                })
            };
            // generate token
            user.generateToken((err, user) => {
                    
                if(err) return res.status(400).send(err);

                res.cookie('tc_auth_cookie', user.token).send({
                    isAuth:true,
                    id:user._id,
                    email:user.email
                });
            });
        });
    });
});


// * * * * * * * * * * * * * * * * * * * * post new category
app.post('/api/add-cat', (req, res) => {
    const cat = new Cat( req.body );             // req is the data you post

    cat.save( (err, doc) =>{                      // saves the new document
        if(err) return res.status(400).send(doc);
        res.status(200).json({
            post:true,
            catId:doc._id                       // gets the id from the post
        })
      })
})



// * * * * * * * * * * * * * * * * * * * * post new subcategory
app.post('/api/add-subcat', (req, res) => {
    const subcat = new SubCat( req.body );             // req is the data you post

    subcat.save( (err, doc) =>{                      // saves the new document
        // console.log(doc._id);
        if(err) return res.status(400).send(doc);
        res.status(200).json({
            post:true,
            catId:doc._id                       // gets the id from the post
        })
      })
})


//////////////////////
app.get('/api/accept-item', (req, res) => {
    let itemid = req.query.itemid;
    let userid = req.query.userid;

    let newId = mongoose.Types.ObjectId();

    const itemsPath = './public/assets/media/items/';

    PendingItem.findOne({ _id: itemid }, function(err, pendItem) {
        let data = { 
            ...pendItem._doc,
            _id: newId,
            ownerId: userid,
            accepted: true,
        }

        let newItem = new Item(data);
        pendItem.remove()
        newItem.save( (err, doc) =>{
            if(err) return res.status(400).send(doc);
            res.status(200).json({
                swapped:true,
                itemId:doc._id
            })
        })
    
    })


    if (fs.existsSync(`${itemsPath}${itemid}`)) {

        fs.renameSync(`${itemsPath}${itemid}`, `${itemsPath}${newId}`, (err) => {
            if (err) {
              throw err;
            }
            fs.statSync(`${itemsPath}${newId}`, (error, stats) => {
              if (error) {
                throw error;
              }
              console.log(`ACCEPT-ITEM RENAME STATS: ${JSON.stringify(stats)}`);
            });
          });

    }

})






// ****************************************************************
// **************************** UPDATE ****************************
// ****************************************************************








// * * * * * * * * * * * * * * * * * * * * update item
app.post('/api/item-update', (req, res) => {
    // new:true allows upsert
    Item.findByIdAndUpdate(req.body._id, req.body, {new:true}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})


///////////////// * * * * * * * * * * update pending item
app.post('/api/item-pend-update', (req, res) => {
    // new:true allows upsert
    PendingItem.findByIdAndUpdate(req.body._id, req.body, {new:true}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})



// * * * * * * * * * * * * * * * * * * * * update cat
app.post('/api/cat-update', (req, res) => {
    // new:true allows upsert
    Cat.findByIdAndUpdate(req.body._id, req.body, {new:true}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})


// * * * * * * * * * * * * * * * * * * * * update subcat
app.post('/api/subcat-update', (req, res) => {
    // new:true allows upsert
    SubCat.findByIdAndUpdate(req.body._id, req.body, {new:true}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})



// * * * * * * * * * * * * * * * * * * * * update intro text
app.post('/api/update-intro-text', (req, res) => {
    // new:true allows upsert
    Intro.findOneAndUpdate({}, req.body, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})


// * * * * * * * * * * * * * * * * * * * * update info text
app.post('/api/update-info-text', (req, res) => {
    // new:true allows upsert
    Info.findOneAndUpdate({}, req.body, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})




// ****************************************************************
//  **************************** DELETE ***************************
// ****************************************************************




// * * * * * * * * * * * * * * * * * * * *  delete item
app.delete('/api/delete-item', (req, res) => {
    let id = req.query.id;

    Item.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json(true);
    })
})



/////////////////// * * * * * * * * * * * * * * * * * * * *  delete item
app.delete('/api/del-pend-item', (req, res) => {
    let id = req.query.id;

    PendingItem.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json(true);
    })
})


// * * * * * * * * * * * * * * * * * * * *  delete cat
app.delete('/api/delete-cat', (req, res) => {
    let id = req.query.id;

    Cat.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json(true);
    })
})


// * * * * * * * * * * * * * * * * * * * *  delete subcat
app.delete('/api/delete-subcat', (req, res) => {
    let id = req.query.id;

    SubCat.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json(true);
    })
})



//  ************************************************************
//  ************ FS ********************************************
//  ************************************************************


const isDirEmpty = (dirname) => {
    return fs.promises.readdir(dirname).then(files => {
        return files.length === 0;
    });
}



// delete file
app.post('/api/delete-file', function(req, res) {
    let query = './public/assets/media';

    let fullPath = query + req.body.path

    fs.unlink(fullPath, function (err) {
        if (err) throw err;
        res.send('File deleted!');
    })
});


// get files in folder

app.post('/api/get-files-folder', (req, res) => {
    
    console.log('API/GETFILESFOLDER CALLED');
    let query = './public/assets/media';

    let fullPath = query + req.body.folder
    console.log('FS.READDIR WITH FULLPATH:', fullPath)

    fs.readdir(fullPath, {withFileTypes: true}, (err, files) => {
        if (err) {
            console.log('GET-FILES-FOLDER: error finding files in folder / no files in folder')
        } else if (files.length && files[0].name === '.DS_Store') {
            files.shift()
        }
        
        res.send(files)
        console.log('GET-FILES-FOLDER FILES', files)
    })
});


// remove directory recursively
app.post('/api/delete-dir', function(req, res) {
    const baseUrl = './public/assets/media';

    let section = req.body.section;
    let id = req.body.id;

    let dir = path.resolve(baseUrl, section, id)


    console.log('DIR TO BE DELETED', dir);

    const deleteDir = (dir, subDir) => {
        fs.rmdir(subDir, () => {
            console.log('SUBDIR BEING DELETED:', subDir);
            fs.rmdir(dir, () => {
                console.log('DIR BEING DELTED: ', dir);
            })
        })
    }

    if (dir != baseUrl) {
        fs.readdir(dir, {withFileTypes: true}, (err, files) => {
            if (files && files.length) {
                files.forEach( file => {
                    let string = path.resolve(dir, file.name)
                    if (fs.lstatSync(string).isFile()) {
                        fs.unlink(string, function (err) {
                            if (err) throw err;
                            console.log('FILE DELETED: ', file.name);
                        })
                    }

                    if (fs.lstatSync(string).isDirectory()) {
                        let subDir = path.resolve(dir, file.name)
                        console.log('SUBDIR TO BE DELETED: ', subDir);

                        fs.readdir(subDir, {withFileTypes: true}, (err, files) => {
                            files.forEach( file => {
                                let subFile = path.resolve(string, file.name)
                                if (fs.lstatSync(subFile).isFile()) {
                                    fs.unlink(subFile, function (err) {
                                        if (err) throw err;
                                        console.log('SUB FILE DELETED: ', file.name);
                
                                        deleteDir(dir, subDir);

                                        

                                    })
                                }
                            })
                        })
                    }
                })
            }
        })
    }
    return res.status(200)
})




// // get number of files
// app.post('/get-number-files', function(req, res) {
//     const baseUrl = './public/assets/media';
//     let section = req.body.section;
//     let id = req.body.id;
//     let fileType = req.body.filetype;
//     let dir = path.resolve(baseUrl, section, id, fileType)
//     let numFiles = 0;

//     if (dir != baseUrl) {
//         fs.readdir(dir, {withFileTypes: true}, (err, files) => {
//             if (files && files.length) {
//                 files.forEach( file => {
//                     numFiles++
//                 })
//             }
//         })
//     }
//     return res.status(200)
// })






// *********************** FILE SERVER ************************



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
/////////////////////// UPLOAD ITEM IMAGES /////////////////////////////
////////////////////////////////////////////////////////////////////////


let storageArray = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `./public/assets/media/items/${req.params.id}/original`
        mkdirp.sync(path);
        cb(null, path)

    },
    filename: function (req, file, cb) {
        let uniqueId = mongoose.Types.ObjectId();
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        switch(extension) {
            case 'jpeg':
              ext = 'jpg'
              break;
            case 'png':
                ext = 'jpg'
                break;
            default:
              ext = extension
          }
        cb(null, `${uniqueId}.${ext}`)
    }
})

let uploadArray = multer({ storage: storageArray }).array('files');


app.post('/api/upload-array/:id', 
    (req, res, next) => {
        console.log('first callback')
        next()
    },
    function (req, res, next) {
        uploadArray(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log(err) // A Multer error occurred when uploading.
            } else if (err) {
                console.log(err) // An unknown error occurred when uploading.
            }
    
            
            next(); // Everything went fine.
        })
        
    }, 

    (req, res, next) => {
        let thumbPath = `./public/assets/media/items/${req.params.id}/sq_thumbnail`;

        mkdirp.sync(thumbPath);

        fs.readdir(thumbPath, function(err, thumbFiles) {
            thumbFiles = thumbFiles.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
            if (!thumbFiles.length) {
                sharp(req.files[0].path)
                    .resize(500, 500)
                    .toFile(`${thumbPath}/0.jpg`, (err) => {
                        if (err) {
                            console.log('UPLOAD-FIELDS SHARP ERROR', err);
                        } else {
                            console.log('UPLOAD-FIELDS: sharp success');
                            res.send("Sq thumbnail uploaded successfully.");
                        }
                    })
            } else {
                console.log('THUMB FILES: ', thumbFiles)
                res.send("Files uploaded.");
            }
        })
    }
)




// *********************** CATEGORY IMAGE ************************

app.post(
    'api/upload-cat/:id',
    function(req, res) {
        
        let catId = req.params.id;
        console.log('UPLOAD-CAT REQ.FILE: ', req.file);
        let index = 0;
     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                let dest = `./public/assets/media/cover_img_cat`;
                mkdirp.sync(dest);
                cb(null, dest)
                
            },
            filename: function (req, file, cb) {
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


// *********************** SUBCATEGORY IMAGE ************************


app.post(
    '/api/upload-subcat/:id',
    function(req, res) {
        
        let subCatId = req.params.id;
        console.log('UPLOAD-SUBCAT REQ.FILE', req.file);
        let index = 0;
     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                let dest = `./public/assets/media/cover_img_subcat`;
                mkdirp.sync(dest);
                cb(null, dest)
                
            },
            filename: function (req, file, cb) {
                cb(null, `${subCatId}.jpg` );
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
    '/api/upload-intro-img',
    function(req, res) {
        
        console.log('UPLOAD-INTRO-IMG REQ.FILE', req.file);

     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                let dest = `./public/assets/media/intro`;
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
    '/api/upload-info/:number',
    function(req, res) {
        
        let number = req.params.number;
        console.log('UPLOAD-INFO REQ.FILE: ', req.file);

     
        multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {

                let dest = `./public/assets/media/info`;
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





//  ********************************************************


const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`SERVER RUNNING : port ${port}`)
})