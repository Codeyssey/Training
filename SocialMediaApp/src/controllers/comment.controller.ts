
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import mongoose from 'mongoose';
import { IError, IPostDoc, IRequest } from '../interface/index.interface'
import { commentService } from '../services/index.service';
import { paginatedResults } from "../utill/index.utill";

const commentControllers = {
    // Adds a comment in the comment collection and pushes it to that particular post
    addComment: async (req: IRequest, res:express.Response, next: express.NextFunction) => {
        try{
            // Get Post from req.post since verify access middleware is already called
            // Send the post object to service along with
            // comment object which would be saved in req..payload since validate comment was called before
            // save the post id in comment post id
            // Add comment to post list
            const createResponse = await commentService.addComment(req.post as IPostDoc, req.payload);
            if(createResponse.isError) throw createResponse;
            // Sending Response back to the client
            res
            .status(201)
            .json({
                message: createResponse.message,
                comment: createResponse.comment
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Adding Post Controller"
            })
        }
    },
    // gets a comment and gets all of its replies
    getCommentAndReplies: async (req: IRequest, res:express.Response, next: express.NextFunction) => {
        try{
            const response = await commentService.getCommentWithReplies(req.body.commentId);
            if(response.isError) throw response;
            // Sending Response back to the client
            res
            .status(201)
            .json({
                message: "Showing Comment And Its Replies",
                comments: response.comments
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Get Post Controller"
            })
        }
    },
    // deletes comment along with all of its replies
    deleteComment: async (req: IRequest, res:express.Response, next: express.NextFunction) => {
        try{
            const commentIdObj = new mongoose.Types.ObjectId(req.body.commentId);
            const deleteResponse = await commentService.deleteComment(req.post as IPostDoc, commentIdObj);
            if(deleteResponse.isError) throw deleteResponse;
            // Sending Response back to the client
            res
            .status(201)
            .json({
                message: deleteResponse.message,
            });
        }catch(err: IError | any){
            res
            .status( err.status || 400)
            .json({
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Adding Post Controller"
            })
        }
    },
}
export default commentControllers;
