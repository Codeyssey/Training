import mongoose from "mongoose";
import { rejections } from "winston";
import { usersDAL, postsDAL, commentsDAL } from '../dataAccessLayer/index.dal';
import { IError, IUserDoc, IUser, IUserPlainObj, IPost, IPostDoc, ICommentDoc } from '../interface/index.interface'
import { checkPW } from '../utill/index.utill';

const postService = {
    //* Create Post Service
    createPost: async(payload: IPost) => {
        try{
            // Add to post collection
            const saveResponse = await postsDAL.createPost(payload);
            if ( saveResponse.isError ) throw saveResponse;
            return {
                isError: false,
                message: "You Have Successfully Posted On The Social Network",
                post: saveResponse.savedPost
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Save Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services Layer"
            }
        }
    },
    getSingle: async(postId: string | mongoose.Types.ObjectId) => {
        try{
            const getResponse = await postsDAL.getSingle(postId);
            if (getResponse.isError) throw getResponse;
            return {
                isError: false,
                post: getResponse.post
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Service Error Occured: Could Not Get Post",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services"
            }
        }
    },
    update: async(post: IPostDoc, body: string) => {
        try{
            // Update the post
            const updatePayload = {
                body: body
            };
            const updateResponse = await postsDAL.update(post._id, updatePayload);
            if (updateResponse.isError) throw updateResponse;
            // Returning Response
            return {
                isError: false,
                update: updateResponse.update
            };
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During UnLike Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services Layer"
            }
        }
    },
    //* like post service
    like: async(post: IPostDoc, loggedInUser: IUserDoc) => {
        try{
            // First Make Sure Current User Not In Like Already
            const inLike = await post.likes?.some(
                (e: mongoose.Types.ObjectId) => e.equals(loggedInUser._id)
            );
            if (inLike) throw {
                message: "You Have Already Liked This Post",
                status: 401
            }
            // Push In Like
            await post.updateOne( { $push: { likes: loggedInUser._id } } )
            // End Here
            return {
                isError: false,
                message: "Post Liked"
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Like Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services Layer"
            }
        }
    },
    //* unlike post service
    unlike: async(post: IPostDoc, loggedInUser: IUserDoc) => {
        try{
            await post.updateOne( { $pull: { likes: loggedInUser._id } } )
            // End Here
            return {
                isError: false,
                message: "Post Un Liked"
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During UnLike Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services Layer"
            }
        }
    },
    //* delete comment
    delete: async(post: IPostDoc) => {
        try{
            // Delete all the comments from this post
            // req.post has the post document as it is set in the previous middleware
            await post?.comments?.forEach( async (objectId: mongoose.Types.ObjectId) => {
                const deleteCommentResponse = await commentsDAL.delete(objectId);
                if (deleteCommentResponse.isError) throw deleteCommentResponse;
            })
            // Once all the comments have been deleted then delete the post
            const deletePostResponse = await postsDAL.delete(post._id);
            if (deletePostResponse.isError) throw deletePostResponse;
            return {
                isError: false
            }
        }catch(err: IError | any) {
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Delete Post Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services Layer"
            }
        }
    },
    //
    addCommentToPost: async(post: IPostDoc, comment: ICommentDoc) => {
        try{
            // Push In Comment
            await post.updateOne( { $push: { comments: comment._id } } )
            // End Here
            return {
                isError: false,
                message: "Comment Added"
            }
        }catch(err: IError | any){
            // Removing comment from the collection too
            await commentsDAL.delete(comment._id);
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Add Comment Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services Layer"
            }
        }
    },
    deleteCommentFromPost: async(post: IPostDoc, comment: ICommentDoc) => {
        try{
            // Push In Comment
            await post.updateOne( { $pull: { comments: comment._id } } )
            // End Here
            return {
                isError: false,
                message: "Comment Deleted From Post"
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "An Unexpected Error Occured During Delete Comment Service",
                status: err.status || 400,
                stage: err.stage || "Failed at Post Services Layer"
            }
        }
    },
    //* Gets the social feed
    getFeed: async(currentUser: IUserDoc) => {
        try{
            const getUserPostResponse = await postsDAL.getPostBasedOnCreator(currentUser._id);
            if (getUserPostResponse.isError) throw getUserPostResponse;
            const feedPosts = getUserPostResponse.userPosts as (IPostDoc & { _id: mongoose.Types.ObjectId;})[];
            const followingUsersPost = await Promise.all(
                (currentUser.followings as mongoose.Types.ObjectId[]).map(
                    async (followingUserId) => {
                        let getFollowingPostResponse = await postsDAL.getPostBasedOnCreator(followingUserId);
                        if (getFollowingPostResponse.isError) throw getFollowingPostResponse;
                        return getFollowingPostResponse.userPosts;
                    }
                )
            )
            return {
                isError: false,
                feedPosts: feedPosts.concat(...followingUsersPost as ConcatArray<IPostDoc & { _id: mongoose.Types.ObjectId }>[])
            }
        }catch(err: IError | any){
            return{
                message: err.message || "An Unexpected Error Occured",
                Error: true,
                stage: err.stage || "Get Feed Service",
                status: err.status || 400
            };
        }
    },
}

export default postService;