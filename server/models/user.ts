import mongoose from 'mongoose';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_I = 10;

require('dotenv').config({path: '../../.env'})

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    name:{
        type:String,
        maxlength:100
    },
    lastname:{
        type:String,
        maxlength:100
    },
    role:{
        type:Number,
        default:0
        
    },
    token:{
        type:String
    }
})


// pre-save: hash the password before saving
// middleware uses next
userSchema.pre('save', function(next: any){
    let user = this;

    if (user.isModified('password')) {
        // hash the password
        bcrypt.genSalt(SALT_I, function(err: any, salt: any){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err: any, hash: any) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})


// create function to compare passwords (to be called in server.js)
userSchema.methods.comparePassword = function(candidatePassword: any, cb: any) {
    bcrypt.compare(candidatePassword, this.password, function(err: any, isMatch: any) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}


// create a method to generate token
userSchema.methods.generateToken = function(cb: any) {
    let user = this;
    // generate token
    let token = jwt.sign(user._id.toHexString(), process.env.PW); // old: config.SECRET
    

    // save all user info, with token
    user.token = token;
    user.save(function(err: any, user: any) {
        if(err) return cb(err);
        cb(null, user);
    });
}

// find user by token, check in cookies
// userSchema.statics.findByToken = function(token, cb) {
//     let user = this;

//     // decode contains the user id
    
//     jwt.verify(token, process.env.PW, function(err, decode) { // old: config.SECRET
//         user.findOne({"_id":decode, "token":token}, function(err, user) {
//             if(err) return cb(err);
//             // return all user info if token is correct

//             cb(null, user)
//         })
//     })
// }

userSchema.statics.findByToken = async function(token: any) {
    let user = this;

    // decode contains the user id
    
    const decode = jwt.verify(token, process.env.PW); // old: config.SECRET
    const foundUser = await user.findOne({"_id":decode, "token":token});
    if (!foundUser) return null;
    return foundUser;
}

// delete token on logout
userSchema.methods.deleteToken = function(token: any, cb: any) {
    let user = this;

    // unset the value (to 1)
    user.update({$unset:{token:1}}, (err: any, user: any) => {
        if(err) return cb(err);
        cb(null, user);
    })
}



const User = mongoose.model('User', userSchema);

module.exports = { User }