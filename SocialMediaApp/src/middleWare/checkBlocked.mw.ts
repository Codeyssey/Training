//* Finalized
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import userService from '../services/user.service';
import { IRequest } from '../interface/index.interface';
import mongoose from 'mongoose';

const checkBlocked = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try{
        // Find The User You Want To Follow
        const userId = new mongoose.Types.ObjectId(req.body.id)
        const userDocResponse = await userService.getUserById(userId);
        if (userDocResponse.isError) throw userDocResponse
        // Check If You Are In Their Block List
        const isInBlockList = userDocResponse.user?.blockedList
                                ?.some( (e: mongoose.Types.ObjectId) => e.equals(req.loggedInUser?._id) );

        if (isInBlockList) throw Error("This User Has Blocked You, You Can Not Follow This User");
        // Setting req.requestedUser here for the found user to not fetch it again
        req.requestedUser = userDocResponse.user;
        next();
    }catch(err: any){
        return res
        .status(401)
        .json({
            stage: "Check Blocked User Stage",
            message: err.message || "An Unexpected Error Occured While Authenticating The Token",
            Error: true
        })
    }
}

export default checkBlocked;