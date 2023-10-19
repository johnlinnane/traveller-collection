// @ts-nocheck
import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from "path";
import sharp from 'sharp';
import https from 'https';

const app: Application = express();

import dotenv from 'dotenv';
dotenv.config({path: '../.env'})

import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
const fsPromises = fs.promises;
import mkdirp from 'mkdirp';


mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB, { useNewUrlParser: true }) //old: useMongoClient: true
    .catch(error => console.log('MONGOOSE CONNECT ERROR: ', error));


import { User } from './models/user';
import { Item, PendingItem } from './models/item';
import { Cat } from './models/cat';
import { SubCat } from './models/subcat';
import { Intro } from './models/intro';
import { Info } from './models/info';


import { authMiddleware } from './middleware/auth_middleware';
// import { fileURLToPath } from 'url';


// middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: [
        process.env.CLIENT_PREFIX,
        process.env.DB, 
        process.env.CLIENT_BUILD_PREFIX,
        process.env.FILE_SERVER_PREFIX,
        process.env.PRODUCTION_PREFIX
    ]
}));

// **************************** GET ****************************

app.get('/api/auth-get-user-creds', authMiddleware, async (req: Request, res: Response) => {
    try {
        res.json({
            isAuth:true,
            id:req.user._id,
            email:req.user.email,
            name:req.user.name,
            lastname:req.user.lastname
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/logout', authMiddleware, async (req: Request, res: Response) => {
    try {
        req.user.deleteToken(req.token);
        res.sendStatus(200)
    } catch (err) {
        res.status(400).send(err);
    }
}) 

app.get('/api/get-item-by-id', async (req: Request, res: Response) => {
    try {
        let id: number = req.query.id;
        const data = await Item.findById(id);
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-pend-item-by-id', async (req: Request, res: Response) => {
    try {
        let id = req.query.id;
        const data = await PendingItem.findById(id);
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-parent-pdf', async (req: Request, res: Response) => {
    try {
        let id = req.query.id;
        const data = await Item.findById(id);
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/search-items', async (req: Request, res: Response) => {
    let input: string = req.query.input.toLowerCase();
    let resultsNumber: number = parseInt(req.query.resultsNumber, 10);

    const fields = ['title', 'creator', 'description', 'address'];
    const query = fields.map(field => ({
        [field]: { "$regex": input, "$options": "i" }
    }));

    try {
        const data = await Item.find({ $or: query }).select('title creator').limit(resultsNumber);
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/all-items', async (req: Request, res: response) => {
    try {
        const data = await Item.find({});
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/all-pend-items', async (req: Request, res: response) => {
    try {
        const data = await PendingItem.find({});
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/items', async (req: Request, res: Response) => {
    try {
        let skip = parseInt(req.query.skip);
        let limit = parseInt(req.query.limit);
        let order = req.query.order;

        const data = await Item.find().skip(skip).sort({_id:order}).limit(limit).exec();
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const data = await User.find({});
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/user-items', async (req: Request, res: Response) => {
    try {
        const data = await Item.find({ownerId:req.query.user}).exec();
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-all-categories', async (req: Request, res: Response) => {
    try {
        const data = await Cat.find({}).exec();
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/api/get-all-subcategories', async (req: Request, res: Response) => {
    try {
        const data = await SubCat.find({});
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-items-by-cat', async (req: Request, res: Response) => {
    try {
        let value = req.query.value;
        const data = await Item.find({ category_ref:value }).exec();
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-next-item', async (req: Request, res: Response) => {
    try {
        let oldId = req.query.oldId;
        let query = {_id: {$gt: oldId}}
        const data = await Item.findOne(query);
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-prev-item', async (req: Request, res: Response) => {
    try {
        let oldId = req.query.oldId;
        const data = await Item.findOne({_id: {$lt: oldId}}, null, { sort: { '_id':-1 } });
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-items-by-subcat', async (req: Request, res: Response) => {
    try {
        let subcatId = req.query.subcatid;
        const data = await Item.find({ subcategory_ref: subcatId}, {}, { sort: { '_id':1 } });
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-cat-by-id', async (req: Request, res: Response) => {
	try {
    	let value = req.query.id;
    	const cat = await Cat.findOne({ _id: value }).exec();
        if(!cat) {
            throw new Error('Not found');
        }
    	res.send(cat);
	} catch (err) {
    	res.status(400).send(err);
	}
});

app.get('/api/get-subcat-by-id', async (req: Request, res: Response) => {
    try {
        let value = req.query.subcatid;
        const data = await SubCat.find({ _id:value }).exec();
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-intro-text', async (req: Request, res: Response) => {
    try {
        const data = await Intro.findOne({}, {}, { sort: { '_id':1 } });
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.send(err);
    }
})

app.get('/api/get-info-text', async (req: Request, res: Response) => {
    try {
        const data = await Info.findOne({}, {}, { sort: { '_id':1 } });
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/get-items-with-coords', async (req: Request, res: Response) => {
    try {
        const data = await Item.find( { "geo.latitude": {$ne:null} }, {}, { sort: { '_id':1 } });
        if(!data) {
            throw new Error('Not found');
        }
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

// ********************* POST ****************************

app.post('/api/create-item', async (req: Request, res: Response) => {
    try {
        const item = new Item( req.body );
        const data = await item.save();
        
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).json({
            post:true,
            itemId:data._id
        })
    } catch (err) {
        res.status(400).send(doc);
    }
})

app.post('/api/create-pending-item', async (req: Request, res: Response) => {
    try {
        const pendingItem = new PendingItem( req.body );
        const data = await pendingItem.save();
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).json({
            post:true,
            itemId:data._id
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/api/register', async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        const data = await user.save();
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).json({
            success:true,
            user:data
        })
    } catch (err) {
        res.json({success:false})
    }
})

app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const data = await User.findOne({'email':req.body.email});
        if(!data) {
            return res.json({isAuth:false, message:'Incorrect username or password'})
        };
        data.comparePassword(req.body.password, async (err, isMatch) => {
            if(!isMatch) {
                return res.json({
                    isAuth:false,
                    message:'Incorrect username or password'
                })
            };
            const savedUser = await data.generateToken();
            if(!savedUser) return res.status(400).send(err);
            res.cookie('tc_auth_cookie', savedUser.token, { sameSite: 'lax', secure: true }).send({
                isAuth:true,
                id:savedUser._id,
                email:savedUser.email
            });
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/api/add-cat', async (req: Request, res: Response) => {
    try {
        const cat = new Cat( req.body );
        const data = await cat.save();
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).json({
            post:true,
            catId:data._id
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/api/add-subcat', async (req: Request, res: Response) => {
    try {
        const subcat = new SubCat( req.body );
        const data = await subcat.save();
        if(!data) {
            throw new Error('Not found');
        }
        res.status(200).json({
            post:true,
            catId:data._id
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api/accept-item', async (req: Request, res: Response) => {
    try {
        let itemid = req.query.itemid;
        let userid = req.query.userid;
        let newId = new mongoose.Types.ObjectId();
        const itemsPath = './../public/assets/media/items/';

        const data = await PendingItem.findOne({ _id: itemid });
        if(!data) {
            throw new Error('Not found');
        }
        let item_data = { 
            ...pendItem._doc,
            _id: newId,
            ownerId: userid,
            accepted: true,
        }
        let newItem = new Item(item_data);
        pendItem.remove()
        newItem.save( (err, data) =>{
            res.status(200).json({
                swapped:true,
                itemId:data._id
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
                });
            });
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

// **************************** UPDATE ****************************

app.post('/api/item-update', async (req: Request, res: Response) => {
    try {

        const data = await Item.findByIdAndUpdate(req.body._id, req.body, {new:true});
        if(!data) {
            throw new Error('Not found');
        }
        res.json({
            success:true,
            data
        });
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/api/item-pend-update', async (req: Request, res: Response) => {
    try {

        const data = await PendingItem.findByIdAndUpdate(req.body._id, req.body, {new:true});
        if(!data) {
            throw new Error('Not found');
        }
        res.json({
            success:true,
            data
        });
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/api/cat-update', async (req: Request, res: Response) => {
    try {
        const data = await Cat.findByIdAndUpdate(req.body._id, req.body, {new:true});
        if(!data) {
            throw new Error('Not found');
        }
        res.json({
            success:true,
            data
        });
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/api/subcat-update', async (req: Request, res: Response) => {
    try {
        const data = await SubCat.findByIdAndUpdate(req.body._id, req.body, {new:true});
        if(!data) {
            throw new Error('Not found');
        }
        res.json({
            success:true,
            data
        });
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/api/update-intro-text', async (req: Request, res: Response) => {
    try {
        const data = await Intro.findOneAndUpdate({}, req.body, { sort: { '_id':1 } });
        if(!data) {
            throw new Error('Not found');
        }
        res.json({
            success:true,
            data
        });
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/api/update-info-text', async (req: Request, res: Response) => {
    try {
        const data = await Info.findOneAndUpdate({}, req.body, { sort: { '_id':1 } });
        if(!data) {
            throw new Error('Not found');
        }
        res.json({
            success:true,
            data
        });
    } catch (err) {
        res.status(400).send(err);
    }
})

//  **************************** DELETE ***************************

app.delete('/api/delete-item', async (req: Request, res: Response) => {
    try {
        let id = req.query.id;
        const data = await Item.findByIdAndRemove(id);
        if(!data) {
            throw new Error('Not found');
        }
        res.json(true);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.delete('/api/del-pend-item', async (req: Request, res: Response) => {
    try {
        let id = req.query.id;
        const data = await PendingItem.findByIdAndRemove(id);
        if(!data) {
            throw new Error('Not found');
        }
        res.json(true);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.delete('/api/delete-cat', async (req: Request, res: Response) => {
    try {
        let id = req.query.id;
        const data = await Cat.findByIdAndRemove(id);
        if(!data) {
            throw new Error('Not found');
        }
        res.json(true);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.delete('/api/delete-subcat', async (req: Request, res: Response) => {
    try {
        let id = req.query.id;
        const data = await SubCat.findByIdAndRemove(id);
        if(!data) {
            throw new Error('Not found');
        }
        res.json(true);
    } catch (err) {
        res.status(400).send(err);
    }
})



//  ************ FS ********************************************

app.post('/api/delete-file', function(req: Request, res: Response) {

        let query = './../public/assets/media';
        let fullPath = query + req.body.path
        fs.unlink(fullPath, function (err) {
            if (err) throw err;
            res.send('File deleted!');
        })
});

app.post('/api/get-files-folder', async (req: Request, res: Response) => {
    try {
        const folderPath = path.join(__dirname, '..', 'public', 'assets', 'media', req.body.folder);
        const files = await fs.promises.readdir(folderPath);
  
        if (files.length === 0) {
            res.send([]);
        } else {
            res.send(files);
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error. File directory not found or Permissions Issue. ' , err});
    }
});

app.post('/api/delete-dir', function(req: Request, res: Response) {
        const baseUrl = './../public/assets/media';
        let section = req.body.section;
        let id = req.body.id;
        let dir = path.resolve(baseUrl, section, id)
        const deleteDir = (dir, subDir) => {
            fs.rmdir(subDir, () => {
                // console.log('SUBDIR BEING DELETED:', subDir);
                fs.rmdir(dir, () => {
                    // console.log('DIR BEING DELTED: ', dir);
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
                            })
                        }
                        if (fs.lstatSync(string).isDirectory()) {
                            let subDir = path.resolve(dir, file.name)
                            fs.readdir(subDir, {withFileTypes: true}, (err, files) => {
                                files.forEach( file => {
                                    let subFile = path.resolve(string, file.name)
                                    if (fs.lstatSync(subFile).isFile()) {
                                        fs.unlink(subFile, function (err) {
                                            if (err) throw err;
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

let storageArray = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        const filePath = `./../public/assets/media/items/${req.params.id}/original`;
        try {
            mkdirp.sync(filePath);
            if (!fs.existsSync(filePath)) {
                console.error('Directory creation failed.');
            }
        } catch (error) {
            console.error('Error creating directory:', error);
        }
        cb(null, filePath)
    },
    filename: function (req: Request, file, cb) {
        let uniqueId = new mongoose.Types.ObjectId();
        let extension = file.mimetype.split("/").pop();
        const extensionMap = {
            'jpeg': 'jpg',
            'png': 'jpg',
            'gif': 'jpg'
          };
          
        let ext = extensionMap[extension] || extension;
        cb(null, `${uniqueId}.${ext}`);
    }
})

let uploadArray = multer({ storage: storageArray }).array('files');

app.post('/api/upload-array/:id', uploadMiddleware, createThumbnail);

function uploadMiddleware(req, res, next) {
    uploadArray(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).send({ message: 'Multer error occurred.' });
        } else if (err) {
            console.log(err);
            return res.status(500).send({ message: 'Unknown error occurred.' });
        }
        next();
    });
}

function createThumbnail(req, res) {
    let thumbPath = `./../public/assets/media/items/${req.params.id}/sq_thumbnail`;
    mkdirp.sync(thumbPath);
    fs.readdir(thumbPath, function(err, thumbFiles) {
        if (err) {
            console.log('Error reading directory:', err);
            return res.status(500).send({ message: 'Error processing images.' });
        }

        thumbFiles = thumbFiles.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
        if (!thumbFiles.length) {
            sharp(req.files[0].path)
                .resize(500, 500)
                .toFile(`${thumbPath}/0.jpg`, (err) => {
                    if (err) {
                        console.log('UPLOAD-FIELDS SHARP ERROR', err);
                        return res.status(500).send({ message: 'Error resizing image.' });
                    } else {
                        res.send("Files uploaded.");
                    }
                });
        } else {
            res.send("Files uploaded.");
        }
    });
}

app.post('/api/upload-cat/:id',
    function(req: Request, res: Response) {
        let catId = req.params.id;
            let index = 0;
            multer({ storage: multer.diskStorage({
                destination: function (req: Request, file, cb) {
                    let dest = `./../public/assets/media/cover_img_cat`;
                    mkdirp.sync(dest);
                    cb(null, dest)
                    
                },
                filename: function (req: Request, file, cb) {
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
    }
);

app.post('/api/upload-subcat/:id',
    function(req: Request, res: Response) {

            let subCatId = req.params.id;
            let index = 0;
            multer({ storage: multer.diskStorage({
                destination: function (req: Request, file, cb) {
                    let dest = `./../public/assets/media/cover_img_subcat`;
                    mkdirp.sync(dest);
                    cb(null, dest)
                },
                filename: function (req: Request, file, cb) {
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

app.post('/api/upload-intro-img',
    function(req: Request, res: Response) {

            multer({ storage: multer.diskStorage({
                destination: function (req: Request, file, cb) {

                    let dest = `./../public/assets/media/intro`;
                    mkdirp.sync(dest);
                    cb(null, dest)
                    
                },
                filename: function (req: Request, file, cb) {
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

app.post('/api/upload-info/:number',
    function(req: Request, res: Response) {

            let number = req.params.number;
            multer({ storage: multer.diskStorage({
                destination: function (req: Request, file, cb) {
                    let dest = `./../public/assets/media/info`;
                    mkdirp.sync(dest);
                    cb(null, dest)
                },
                filename: function (req: Request, file, cb) {
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
const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
};
const httpsServer = https.createServer(options, app);
httpsServer.listen(port, () => {
    console.log(`HTTPS SERVER RUNNING : port ${port}`)
})