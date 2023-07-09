//* Finalized
import * as express from 'express';
import { IError, IRequest, IUserDoc } from '../interface/index.interface';

import { postService } from '../services/index.service';
import canAccessPost from '../utill/canAccessPost.utill';

const verifyPostAccess = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try{
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
        // if the user is a moderator they can access any post
        if (req.loggedInUser?.moderator) {
            next();
            return;
        }

        const foundFlag = await canAccessPost(req.loggedInUser as IUserDoc, post);
        if (!foundFlag) throw Error("You Do Not Have Access To This Post");

        next();
    }catch(err: IError | any){
        return res
        .status(err.status ||400)
        .json({
            stage: err.stage || "Failed At: Verifying if user has access to this post",
            message: err.message || "An Unexpected Error Occured While Checking Access To The Post",
            Error: true
        })
    }
}

export default verifyPostAccess;