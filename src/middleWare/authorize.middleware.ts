import * as express from 'express';
import mongoose from 'mongoose';
import Users from '../models/user.model';
// TODO: We are checking if the user is found or not we should be checking if the user is authorized or not
// TODO: This middleware needs to be updated is handling data access layer functionality
// Authorize if the user is logged in
const authorize_LoggedIn_User = async (req: express.Request, res:express.Response, next: express.NextFunction) =>
{
    try{
        // Getting the user who wants to add a task
        var id = new mongoose.Types.ObjectId(req.session.userID as string);
        const user = await Users.findOne( { _id: id } );
        // const user = getUser();
        if (!user) throw Error("User Not Found");
        res.locals.user = user;
        next();
    }catch(err: any){
        res
        .status(404) // Not found
        .send({
            message: `User Not Found`
        });
    }
};
export default authorize_LoggedIn_User;