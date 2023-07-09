//* Finalized
import * as express from 'express';
import { IPostDoc, IUserDoc, IError, IRequest } from '../interface/index.interface';

import { postService } from '../services/index.service';

const isPostCreator = async (user: IUserDoc, post: IPostDoc) => {
    try{
        // If user acc not == logged in user then you have access to this post and you can move on
        if (user._id.equals(post.userId)) return true;
    }catch(err){
        return false;
    }
}

const verifyPostCreator = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try{
        // if the user is a moderator they can access any post so no need to check if creator or not
        if (req.loggedInUser?.moderator) {
            next();
            return;
        }
        // Get post id from param
        const postID = req.params.postId;
        if (!postID || postID === "") throw Error("URL Parameter Does Not Have Post Id");
        // Get user account of this id
        const getPostResponse = await postService.getSingle(postID);
        if (getPostResponse.isError) throw getPostResponse;
        const post = getPostResponse.post;
        // Cautionary Check
        if (!post || post === null) throw Error("No Post With This Id");
        req.post = post;

        const foundFlag = isPostCreator(req.loggedInUser as IUserDoc, post);
        if (!foundFlag) throw Error("You Do Not Have Access To This Post");

        next();
    }catch(err: any){
        return res
        .status(err.status ||400)
        .json({
            stage: err.stage || "Failed At: Verifying if user has access to this post",
            message: err.message || "An Unexpected Error Occured While Checking Access To The Post",
            Error: true
        })
    }
}

export default verifyPostCreator;