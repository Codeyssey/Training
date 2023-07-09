import { object } from 'joi';
import mongoose from 'mongoose';
import { IUserDoc, IError, IPost, IPostDoc, ICommentDoc } from "../interface/index.interface";
import { Users, Posts } from "./models/index.model";

const postsDAL = {
    //* Create Post Document and adds to posts collection
    createPost: async (payload: IPostDoc | object) => {
        try{
            const newPost: IPostDoc = new Posts(payload);
            const savedPost: IPostDoc = await newPost.save() as IPostDoc;
            return {
                isError: false,
                savedPost: savedPost
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Save Post",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
    getSingle: async (postId: string | mongoose.Types.ObjectId) => {
        try{
            const post = await Posts.findById(postId);
            return {
                isError: false,
                post: post
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Get Post",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
    getPostBasedOnCreator: async (userId: mongoose.Types.ObjectId) => {
        try{
            const userPosts = await Posts.find({ userId: userId });
            return {
                isError: false,
                userPosts: userPosts
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Get Post",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    },
    update: async(postId: mongoose.Types.ObjectId, updatePayload: any) => {
        try{
            const update = await Posts.findByIdAndUpdate(postId, updatePayload, { useFindAndModify: false })
            return {
                isError: false,
                update: update
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During editing post",
                status: err.status || 400,
                stage: err.stage || "Failed at Data Access Layer"
            }
        }
    },
    delete: async(postId: string | mongoose.Types.ObjectId ) => {
        try{
            await Posts.delete( { _id: postId } );
            return {
                isError: false,
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Delete Post",
                status: 500, // Internal Server Error
                stage: "Failed at Data Access Layer"
            }
        }
    }
}

export default postsDAL;