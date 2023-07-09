import mongoose from "mongoose";
import { rejections } from "winston";
import { usersDAL, postsDAL, commentsDAL } from '../dataAccessLayer/index.dal';
import postService from "./post.service";
import { IError, IUserDoc, IUser, IUserPlainObj,
        IPost, IPostDoc, IComment, ICommentDoc } from '../interface/index.interface'
import { checkPW } from '../utill/index.utill';

const commentService = {
    // Adds a comment in the comment collection and pushes it to that particular post
    addComment: async(post: IPostDoc, comment: IComment) => {
        try{
            // Firstly create a comment document and save it in comment collection
            const saveResponse = await commentsDAL.create(comment);
            if ( saveResponse.isError ) throw saveResponse;
            // Now push the comment id of this saved doc to posts.comments array
            const addToPostResponse = await postService.addCommentToPost(post, (saveResponse.savedComment as ICommentDoc ));
            if ( addToPostResponse.isError ) throw addToPostResponse;
            return {
                isError: false,
                message: "You Have Successfully Commented On A Post",
                comment: saveResponse.savedComment
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Save Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Comment Services Layer"
            }
        }
    },
    // gets a comment and all of its replies
    getCommentWithReplies: async(commentId: string) => {
        try{
            const commentIdObj = new mongoose.Types.ObjectId(commentId);
            const response = await commentsDAL.getCommentWithReplies(commentIdObj);
            if (response.isError) throw response;
            return {
                isError: false,
                comments: response.commentWithReplies
            };
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Get Replies Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Comment Services Layer"
            }
        }
    },
    // gets all the comments in the collection grouped with their replies
    getAllComments: async() => {
        try{
            const response = await commentsDAL.getAll();
            if (response.isError) throw response;
            return {
                isError: false,
                comments: response.commentWithReplies
            };
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Get Comments Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Comment Services Layer"
            }
        }
    },
    // deletes comment along with all of its replies
    deleteComment: async(post: IPostDoc, commentId: mongoose.Types.ObjectId) => {
        try{
            // First Get The Comment and all its replies
            const response = await commentsDAL.getCommentWithReplies(commentId);
            if (response.isError) throw response;
            // Remove all of these replies from the comments collection along with post comments array
            await response.commentWithReplies?.replies?.forEach( async (reply: ICommentDoc) => {
                    const deleteResponse = await commentsDAL.delete(reply._id);
                    if (deleteResponse.isError) throw deleteResponse;

                    const deleteFromPostResponse = await postService.deleteCommentFromPost(post, reply);
                    if(deleteFromPostResponse.isError) throw deleteFromPostResponse;
            });
            // Remove the root comment from the collection and array
            const deleteResponse = await commentsDAL.delete(response.commentWithReplies?._id);
            if (deleteResponse.isError) throw deleteResponse;

            const deleteFromPostResponse = await postService.deleteCommentFromPost(post, response.commentWithReplies);
            if(deleteFromPostResponse.isError) throw deleteFromPostResponse;

            return {
                isError: false,
                message: "You Have Successfully Deleted This Comment Along With Its Replies",
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Save Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Comment Services Layer"
            }
        }
    },
}

export default commentService;