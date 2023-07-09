
import * as express from 'express';

import { IError, IPostDoc, IRequest, IUserDoc } from '../interface/index.interface'
import { postService } from '../services/index.service';
import { paginatedResults, dynamicSort } from "../utill/index.utill";
import { io } from '../config/server';
import mongoose from 'mongoose';
import commentsDAL from '../dataAccessLayer/comment.dal';

const postControllers = {
    //* Creates a post
    create: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            const createResponse = await postService.createPost(req.payload);
            if(createResponse.isError) throw createResponse;
            // Sending the created post to all the user followers
            io
            .to(req.loggedInUser?._id.toString())
            .emit('sendToFeed', req.payload);
            // Sending Response back to the client
            res
            .status(201)
            .json({
                message: createResponse.message,
                post: createResponse.post
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Creating Post Controller"
            })
        }
    },
    //* Adding user to like list of a post
    like: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            const likeResponse = await postService.like( req.post as IPostDoc,
                                                        req.loggedInUser as IUserDoc );
            if (likeResponse.isError) throw likeResponse;
            res
            .status(200)
            .json({
                message: likeResponse.message
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Like Post Controller"
            })
        }
    },
    //* Removing user from like list of a post
    unlike: async (req: IRequest, res:express.Response, next: express.NextFunction) => {
        try{
            const unlikeResponse = await postService.unlike( req.post as IPostDoc,
                                                            req.loggedInUser as IUserDoc );
            if (unlikeResponse.isError) throw unlikeResponse;
            res
            .status(200)
            .json({
                message: unlikeResponse.message
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "UnLike Post Controller"
            })
        }
    },
    //* Updates the post
    update: async (req: IRequest, res:express.Response, next: express.NextFunction) => {
        try{
            // Edit post
            const updateResponse= await postService.update(req.post as IPostDoc, req.body.body);
            if (updateResponse.isError) throw updateResponse;
            res
            .status(200)
            .json({
                message: "Post Has Been Updated",
                Update: updateResponse.update
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Edit Post Controller"
            })
        }
    },
    //* Cascade delete post -> delete post and delete all comments
    delete: async (req: IRequest, res: express.Response, next: express.NextFunction) => {
        try{
            const deletePostResposne = await postService.delete(req.post as IPostDoc);
            if(deletePostResposne.isError) throw deletePostResposne;
            // Sending Response back to the client
            res
            .status(201)
            .json({
                Success: true,
                message: "Successfully Deleted Post Along With Its Comments"
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Deleting Post Controller"
            })
        }
    },
    //* Shows the feed to the user
    showFeed: async (req: IRequest, res:express.Response, next: express.NextFunction) => {
        try{
            const feedResponse = await postService.getFeed(req.loggedInUser as IUserDoc);
            if (feedResponse.isError) throw feedResponse;
            // Sorting Array Based On Query Params
            // &sortBy=createdAt&sortType=asc/desc
            const sortBy = req.query.sortBy as string
            const sortType = req.query.sortType as string
            // Sorting the posts
            await feedResponse.feedPosts?.sort(dynamicSort(sortBy, sortType))
            // Pagination
            const page = parseInt(req.query.page as string) || 0;
            const limit = parseInt(req.query.limit as string) || 0;
            const result = paginatedResults(feedResponse.feedPosts, page, limit);

            res
            .status(200)
            .json({
                Feed: `Showing Feed For ${ req.loggedInUser?.firstName }`,
                result
            })
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Show Feed Post Controller"
            })
        }
    }
}
export default postControllers;
