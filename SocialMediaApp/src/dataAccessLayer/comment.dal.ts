import { object } from 'joi';
import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { IUserDoc, IError, IPost, IPostDoc, IComment, ICommentDoc } from "../interface/index.interface";
import { Users, Posts, Comments } from "./models/index.model";

const commentsDAL = {
    // creates a comment document and adds it to the comments collection
    create: async (payload: IComment | object) => {
        try{
            const newComment: ICommentDoc = new Comments(payload);
            const savedComment: ICommentDoc = await newComment.save() as ICommentDoc;
            return {
                isError: false,
                savedComment: savedComment
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Save Comment",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
    // gets a comment and all of its replies
    getCommentWithReplies: async(commentId: mongoose.Types.ObjectId) => {
        try{
            const commentWithReplies = await Comments.aggregate([
                {
                    $match: {
                        _id: commentId
                    },
                },
                {
                    $graphLookup: {
                        from: "comments",
                        startWith: '$_id',
                        connectFromField: '_id',
                        connectToField: 'parentId',
                        as: "replies",
                    }
                }
            ])
            return {
                isError: false,
                commentWithReplies: commentWithReplies[0]
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Get Replies",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
    // gets every comment in the comment collection grouped by their replies
    getAll: async() => {
        try{
            const commentWithReplies = await Comments.aggregate([
                {
                    $graphLookup: {
                        from: "comments",
                        startWith: '$_id',
                        connectFromField: '_id',
                        connectToField: 'parentId',
                        as: "replies",
                    }
                }
            ])
            return {
                isError: false,
                commentWithReplies: commentWithReplies
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Get Comments",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
    // gets single comment based on its id
    getSingleCommentById: async(commentId: string | mongoose.Types.ObjectId) => {
        try{
            const comment = await Comments.findById(commentId);
            return {
                isError: false,
                comment: comment
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Get Comment",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
    // deletes a comment document
    delete: async (commentId: string | mongoose.Types.ObjectId ) => {
        try{
            await Comments.delete( { _id: commentId } );
            return {
                isError: false,
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Delete Comment",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
}

export default commentsDAL;