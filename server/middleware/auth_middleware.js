const { User } = require('../models/user');


let authMiddleware = (req, res, next) => {
    // console.log('req: ', req)
    let token = req.cookies.tc_auth_cookie;


    User.findByToken(token, (err, user) => {

        if(err) {
            // console.log('find by token error:', err)
            throw err;
        }
        
        if(!user) {
            // this is executed if user is not logged in
            // console.log('no user')
            
            
            return res.json({
                // message: 'Email address is not registered',
                error:true
            });
                 
        }
        // console.log('findbytoken successful')
        req.token = token;
        req.user = user;
        next();


    })
    

}

module.exports = { authMiddleware }