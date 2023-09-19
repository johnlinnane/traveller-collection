const { User: UserModel } = require('../models/user');


let authMiddleware = async (req: any, res: any, next: any) => {
    let token = req.cookies.tc_auth_cookie;
    // User.findByToken(token, (err, user) => {
    //     if(err) {
    //         throw err;
    //     }
    //     if(!user) {
    //         return res.json({
    //             error:true
    //         });
    //     }
    //     req.token = token;
    //     req.user = user;
    //     next();
    // })


    if (typeof token !== 'undefined') {
        const user = await UserModel.findByToken(token);
        if(!user) {
            return res.json({
                error:true
            });
        }
        req.token = token;
        req.user = user;
    } else {
        return res.json({
            error:true
        });
    }
    next();
}

module.exports = { authMiddleware }