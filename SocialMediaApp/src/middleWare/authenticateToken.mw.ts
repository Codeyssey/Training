//* Finalized
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { userService } from '../services/index.service';
import { IRequest } from '../interface/index.interface';

const authenticateToken = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try{
        const authHeader = (req.headers as any)['authorization'];       // Using any here to avoid tslint warning //TODO: Remove any from here
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) throw Error("Token Not Set Authorization Failed")

        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err: any, user: ( mongoose.LeanDocument<any> & Required<{ _id: unknown }> ) | any) => {
            if(err) {
                return res
                .status(403)
                .json({
                    message: err.message
                })
            }
            // No Error Occured During Verification
            // Get Document of the user
            const userIdObj = new mongoose.Types.ObjectId(user._id as string);
            const currentUserDocResponse = await userService.getUserById(userIdObj);
            if(currentUserDocResponse.isError) throw currentUserDocResponse;
            req.loggedInUser = currentUserDocResponse.user
        });
        next();
    }catch(err: any){
        return res
        .status(401)
        .json({
            stage: "Authenticate Token Stage",
            message: err.message || "An Unexpected Error Occured While Authenticating The Token",
            Error: true
        })
    }
}

export default authenticateToken;