
import * as express from 'express';
import Users from '../models/user.model';
import users_BusinessLogicLayer from '../services/users.bll';

export const login = async (req: express.Request, res:express.Response, next: express.NextFunction) => {
    try{
        const validateLogin = await users_BusinessLogicLayer.authentiavte_login(res.locals.payload.email, 
                                                                res.locals.payload.password);
        if (validateLogin.isAuthenticated){
            const user = validateLogin.user;
            req.session.userID = String(user?._id);
            res
            .status(200)
            .json({
                message: validateLogin.message,
                sessionID: req.session.userID
            })
        }
        else throw validateLogin.message;
    }catch(err: any){
        res
        .status(404)
        .json({
            message: "ERROR OCCURED",
            error: err.message
        })
    }
}