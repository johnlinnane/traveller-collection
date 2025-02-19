import { Request, Response, NextFunction } from 'express';
const { User: UserModel } = require('../models/user');

let checkCookieMiddleware = async (req: any, res: Response, next: NextFunction) => {
    let token = req.cookies.tc_auth_cookie;
    if (typeof token !== 'undefined') {
        try {
            const user = await UserModel.findByToken(token);
            if(!user) {
                return res.json({
                    error:true
                });
            }
            req.token = user.token;
            req.success = true;
        } catch (err) {
            res.status(400).send(err);
        }
    } 
    return next();
}

module.exports = { checkCookieMiddleware }