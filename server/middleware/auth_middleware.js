const { User } = require('../models/user');


let authMiddleware = (req, res, next) => {
    let token = req.cookies.tc_auth_cookie;
    // console.log('authmiddleware REQ.HEADERS: ', req.headers)
    console.log('authmiddleware REQ.COOKIE: ', req.cookie)
    // console.log('authmiddleware TOKEN: ', token)
    User.findByToken(token, (err, user) => {

        if(err) {
            throw err;
        }
        
        if(!user) {
            // this is executed if user is not logged in
            
            return res.json({
                error:true
            });
                 
        }
        req.token = token;
        req.user = user;
        next();


    })
    

}

module.exports = { authMiddleware }