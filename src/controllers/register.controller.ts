
import * as express from 'express';
import users_BusinessLogicLayer from '../services/users.bll';

export const register = (req: express.Request, res:express.Response) => {
    try{
        const saveUser = users_BusinessLogicLayer.addNewUser(res.locals.payload);
        saveUser
        .then((save_response) => {
            if(!save_response.save) throw Error(save_response.message);
            res
            .status(201)
            .json({
                message: save_response.message,
                user: save_response.user
            })
        })
        .catch((err)=>{
            res
            .status(500) //Internal Server Error
            .json({
                message: "Could Not Register User",
                error: err.message
            })
        })
    }catch(err: any){
        res
        .status(400)
        .json({
            message: "Could Not Register User !",
            error: err.message
        })
    }
}
