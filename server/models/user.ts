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

userSchema.pre('save', function(next: any){
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function(err: any, salt: string){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err: any, hash: string) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function(candidatePassword: any, cb: any) {
    bcrypt.compare(candidatePassword, this.password, function(err: any, isMatch: any) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = async function() {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), process.env.PW);
    user.token = token;
    
    try {
        const savedUser = await user.save();
        if(!savedUser) {
            throw new Error('Not found');
        }
        return savedUser;
    } catch (err) {
        return err;
    }
}

userSchema.statics.findByToken = async function(token: any) {
    let user = this;
    const decode = jwt.verify(token, process.env.PW);
    const foundUser = await user.findOne({"_id":decode, "token":token});
    if (!foundUser) return null;
    return foundUser;
}

userSchema.methods.deleteToken = async function(token: string) {
    try {
        let user = this;
        if (user.token === token) {
            try {
                const query = await user.updateOne({$unset:{token:1}});
                if(!query) {
                    throw new Error('Deletion not successful');
                }
            } catch (err) {
                return err;
            }
        } else {
            throw new Error('Token does not match current user');
        }
    } catch (err) {
        return err;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = { User }