import * as dotenv from 'dotenv';
import mongoose from "mongoose";
import Stripe from 'stripe';

import { postsDAL, usersDAL } from '../dataAccessLayer/index.dal';
import { IError, IUserDoc, IUser, IUserPlainObj, IPostDoc } from '../interface/index.interface'
import { checkPW } from '../utill/index.utill';
import postService from './post.service';

// Setting up stripe constant with the secret key
dotenv.config();
// const STRIPE_SECRET_KEY: string = process.env.PORT as string;
const stripe = new Stripe('sk_test_51LqyRLKRWhoaKj7aHACxdM3qalXkYAeEE5sixW9lkXIWMFOoR5d2NNp4OCUh2gwhSaVkKW4MkuxukO6WoHVIMZc200OLIq3KI9', {
    apiVersion: '2022-08-01',
});

interface IUserServices {
    createUser: (payload: IUser) => Promise<any>;
    getUserById: (Id: mongoose.Types.ObjectId | string) => Promise<any>;
    authenticateLogin: (email: string, password: string) => Promise<any>;
    followUser: (followUser: IUserDoc, currentUser: IUserDoc) => Promise<any>;
    unfollowUser: (followUser: IUserDoc, currentUser: IUserDoc) => Promise<any>;
    update: (userId: mongoose.Types.ObjectId | string, updatePayload: object | any) => Promise<any>;
    paymentCheckoutSession: (userId: string) => Promise<any>;
    delete: (userId: mongoose.Types.ObjectId) => Promise<any>;
}

const userService: IUserServices = {
    //* Create User Service
    createUser: async(payload: IUser) => {
        try{
            // Check If Email Is Unique
            let verificationResponse = await usersDAL.uniqueEmailCheck(payload.email);
            if ( verificationResponse.isError ) throw verificationResponse;
            // Check If UserName Is Unique
            verificationResponse = await usersDAL.uniqueUserNameCheck(payload.userName);
            if ( verificationResponse.isError ) throw verificationResponse;
            // Save the user in database
            const createResponse = await usersDAL.createUser(payload);
            if ( createResponse.isError ) throw Error(createResponse.message);
            // Return to controller
            return {
                isError: false,
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured",
                status: err.status || 400,
                stage: err.stage || "Create User Service"
            }
        }
    },
    //* Gets the user on the basis of its unique document id
    getUserById: async (Id: mongoose.Types.ObjectId | string) => {
        try{
            const userDocResponse = await usersDAL.getUserById(Id);
            if (userDocResponse.isError) throw userDocResponse
            return {
                isError: false,
                user: userDocResponse.user
            }

        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Error Occured: Failed To Get User",
                status: err.status || 401,
                stage: "User Get Service"
            }
        }
    },
    //* authenticates users email and password to login to their account
    authenticateLogin: async(email: string, password: string) => {
        try{
            // Check if user with this email exists
            const findResult = await usersDAL.getUserByEmail(email);
            if (findResult.isError) throw Error("No User Is Registered With This Email");
            // Check if password is correct
            if ( await checkPW(password, (findResult.user as IUserDoc).password) ){
                return {
                    isError: false,
                    message: `User Logged In Successfully, Welcome ${findResult.user?.firstName}`,
                    user: findResult.user
                }
            }
            throw Error();
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Error Occured: Failed To Login Incorrect Password",
                status: 401,
                stage: "Authenticate User Login Service"
            }
        }
    },
    //* Follow user service
    followUser: async (followUser: IUserDoc, currentUser: IUserDoc) => {
        try{
            // Check if the current user already follows them
            const isInFollowingList = currentUser.followings
                                        ?.some( (e: mongoose.Types.ObjectId) => e.equals(followUser._id)  );
            if (isInFollowingList) throw Error("You Are Already Following This User");
            // If All Cases Satisfy Add this user to the current users following list -> Update
            await followUser.updateOne( { $push: { followers: currentUser._id } } )
            // Update following of current user
            await (currentUser as (IUserDoc & {_id: mongoose.Types.ObjectId; }))
            .updateOne( { $push: { followings: followUser._id } } )

            return {
                isError: false
            }
            // Add the current user to the their followers list
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Error Occured: Failed To Follow User",
                status: err.status || 401,
                stage: err.stage || "Follow User Service"
            }
        }
    },
    //* Unfollow user service
    unfollowUser: async (followUser: IUserDoc, currentUser: IUserDoc) => {
        try{
            // Check if the current user already follows them
            const isInFollowingList = currentUser.followings
                                        ?.some( (e: mongoose.Types.ObjectId) => e.equals(followUser._id)  );
            if (!isInFollowingList) throw Error("You Are Not Following This User");
            // If All Cases Satisfy Add this user to the current users following list -> Update
            await followUser.updateOne( { $pull: { followers: currentUser._id } } )
            // Update following of current user
            await (currentUser as (IUserDoc & {_id: mongoose.Types.ObjectId; }))
            .updateOne( { $pull: { followings: followUser._id } } )

            return {
                isError: false
            }
            // Add the current user to the their followers list
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Error Occured: Failed To Un Follow User",
                status: err.status || 401,
                stage: err.stage || "Unfollow User Service"
            }
        }
    },
    //* Update users details
    update: async (userId: mongoose.Types.ObjectId | string, updatePayload: object | any) => {
        try{
            const updateResponse = await usersDAL.updateUser(userId, updatePayload);
            if (updateResponse.isError) throw updateResponse
            return {
                isError: false,
                update: updateResponse.update
            };
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Error Occured: Failed To Edit User",
                status: err.status || 401,
                stage: "User Service"
            }
        }
    },
    //* Creates a stripe payment checkout for the user to pay for social feed service
    paymentCheckoutSession: async (userId: string) => {
        try{
            const checkoutParams: Stripe.Checkout.SessionCreateParams = {
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                      currency: 'usd',
                      unit_amount: 1000,
                      product_data: {
                        name: 'Social Feed Access Payment',
                      },
                    },
                    quantity: 1,
                  }],
                success_url: `${ process.env.SERVER_URL }/${ userId }/socialfeedPayment-success`,
                cancel_url: "error",
            };
            const checkoutSession: Stripe.Checkout.Session =
                                            await stripe.checkout.sessions.create(checkoutParams);
            if(checkoutSession.url === "error"){
                throw Error("Could Not Create User Checkout: Redirect To Cancel URL");
            }

            const markUserAsPendingResponse = await usersDAL.updateUser(userId, { paid: "Pending" } );
            if(markUserAsPendingResponse.isError) throw markUserAsPendingResponse;

            return {
                isError: false,
                checkoutSession: checkoutSession
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Error Occured: Checkout Failed",
                status: err.status || 401,
                stage: err.stage || 'User Service Stage',
                detailedErrorMessage: err
            }
        }
    },
    // Cascade delete for users -> if user deleted deleted all of its posts and comments of that post
    delete: async (userId: mongoose.Types.ObjectId) => {
        try{
            // Get all posts where this user id === user id of creator
            const getAllPostsResponse = await postsDAL.getPostBasedOnCreator(userId);
            if(getAllPostsResponse.isError) throw getAllPostsResponse;
            // Now delete these posts
            getAllPostsResponse.userPosts?.forEach( async (postDoc: IPostDoc) => {
                const postDeleteResponse = await postService.delete(postDoc);
                if (postDeleteResponse.isError) throw postDeleteResponse;
            } )
            //  Now delete the user
            const userDeleteResponse = await usersDAL.delete(userId);
            if (userDeleteResponse.isError) throw userDeleteResponse;
            return {
                isError: false
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Error Occured: Failed To Delete User",
                status: err.status || 401,
                stage: "User Service"
            }
        }
    }
};

export default userService;