const { User } = require('../models/user');


let authMiddleware = (req, res, next) => {

    let token = req.cookies.tc_auth_cookie;

    User.findByToken(token, (err, user) => {
        if(err) throw err;
        
        if(!user) return res.json({
            // message: 'Email address is not registered',
            error:true
        });

        req.token = token;
        req.user = user;
        next();


    })
    

}

module.exports = { authMiddleware }