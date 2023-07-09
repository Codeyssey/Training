
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { IError, IUserDoc, IRequest } from '../interface/index.interface'
import { userService } from '../services/index.service';

interface IUserControllers {
    registerUser: (req: IRequest, res:express.Response, next: express.NextFunction) => Promise<void>,
    loginUser: (req: IRequest, res:express.Response, next: express.NextFunction) => Promise<void>,
    followUser: (req: IRequest, res:express.Response, next: express.NextFunction) => Promise<void>,
    unfollowUser: (req: IRequest, res:express.Response, next: express.NextFunction) => Promise<void>,
    update: (req: IRequest, res:express.Response, next: express.NextFunction) => Promise<void>,
    paymentCheckoutSession: (req: IRequest, res:express.Response, next: express.NextFunction) => Promise<void>,
    markAsPaidUser: (req: IRequest, res:express.Response, next: express.NextFunction) => Promise<void>,
    makeModerator: (req: IRequest, res: express.Response, next: express.NextFunction) => Promise<void>,
    delete: (req: IRequest, res: express.Response, next: express.NextFunction) => Promise<void>,
}

const userControllers: IUserControllers = {
    //* Register/Create User Controller
    registerUser: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            // Call service to create user
            const response = await userService.createUser(req.payload);
            // Check the response of the service if an error has occured
            if(response.isError) throw response;
            // Send response to client
            res
            .status(201)
            .json({
                Success: true,
                message: "User Has Been Registered Successfully"
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                Error: true,
                message: err.message || "An Unexpected Error Occured",
                stage: err.stage || "User Controller Stage"
            })
        }
    },
    //* Login User Controller
    loginUser: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            // Call authentication service to login user with the particular credentials
            const authenticationResponse = await userService.authenticateLogin(
                                    req.body.email, req.body.password );
            // if the password and email is authenticated then add to jwt
            if ( !authenticationResponse.isError ){
                const user = authenticationResponse.user as IUserDoc;
                // Converting User Document To A Plain User Object, Could Have Used
                const loggedInUserPayload = user.toObject({ flattenMaps: true });
                // Set up the json web token
                const accessToken = jwt.sign(
                    loggedInUserPayload,
                    process.env.ACCESS_TOKEN_SECRET as string
                );
                // Sending Response
                res
                .status(200)
                .json({
                    Success: true,
                    message: authenticationResponse.message,
                    accessToken: accessToken,
                    User: user
                })
            }
            else throw authenticationResponse;
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                Error: true,
                message: err.message || "An Unexpected Error Occure:",
                stage: 'Login User Controller'
            })
        }
    },
    //* Follow a User Controller
    followUser: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            const followResponse = await userService.followUser(
                                            req.requestedUser as IUserDoc,
                                            req.loggedInUser as IUserDoc
                                        );
            if(followResponse.isError) throw followResponse;
            res
            .status(200)
            .json({
                Success: true,
                message: `You Are Now Following ${req.requestedUser?.firstName}`
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                Error: true,
                stage: err.stage || 'Follow User Controller',
                message: err.message || "An Unexpected Error Occured",
            })
        }
    },
    //* Unfollow a User Controller
    unfollowUser: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            const unfollowResponse = await userService.unfollowUser(
                                                req.requestedUser as IUserDoc,
                                                req.loggedInUser as IUserDoc 
                                            );
            if(unfollowResponse.isError) throw unfollowResponse;
            res
            .status(200)
            .json({
                Success: true,
                message: `You Have Unfollowed ${req.requestedUser?.firstName}`
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Unfollow User Controller"
            })
        }
    },
    // * Update User Details
    update: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            const updateResponse = await userService.update(
                                        req.loggedInUser?._id, req.body
                                    );
            if(updateResponse.isError) throw updateResponse;
            res
            .status(200)
            .json({
                Success: true,
                message: `You Have Edited ${req.loggedInUser?.firstName}'s Profile`
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                Error: true,
                message: err.message || "An Unexpected Error Occured",
                stage: err.stage || "User Controller"
            })
        }
    },
    //* Creates a checkout session for users
    paymentCheckoutSession: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            // Create Checkout Sessions using user service layer
            const response = await userService.paymentCheckoutSession(req.params.userId);
            if (response.isError) throw response;
            // Sending response back
            res
            .status(200)
            .json({
                message: `URL Sent add your card details`,
                url: response.checkoutSession?.url
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                Error: true,
                message: err.message || "An Unexpected Error Occured",
                stage: err.stage || "User Controller",
                error: err.detailedErrorMessage
            })
        }
    },
    //* On Payment Success
    markAsPaidUser: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            // mark the current logged in user as a paid user
            const markingUserAsPaidResponse = await userService.update(
                                        req.params.userId, { paid: true }
                                    );
            if(markingUserAsPaidResponse.isError) throw markingUserAsPaidResponse;

            res
            .status(200)
            .json({
                Success: true,
                message: `payment successful you can now access your social feed`,
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "User Controller",
                error: err || null
            })
        }
    },
    //* Make a user a moderator
    makeModerator: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            // If a user is not a moderator then they can not access this route send error response
            if( !req.loggedInUser?.moderator) throw Error('You are not authorized to access this route, please contact a moderator');
            // Update user as moderator
            const response = await userService.update(req.body.id, { moderator: true });
            if (response.isError) throw response;

            res
            .status( 200)
            .json({
                Success: true,
                message: "User has been marked as a moderator"
            })
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "User Controller",
                error: err || null
            })
        }
    },
    delete: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            const deleteResponse = await userService.delete(req.loggedInUser?._id);
            if(deleteResponse.isError) throw deleteResponse;
            res
            .status(200)
            .json({
                message: "Successfully deleted user along with all of its posts and the comments on those posts"
            })
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "User Controller",
                error: err || null
            })
        }
    }
}

export default userControllers;