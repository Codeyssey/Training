//* Finalized
import * as express from 'express';
import commentsDAL from '../dataAccessLayer/comment.dal';
import { IError, IRequest } from '../interface/index.interface';

import { postService } from '../services/index.service';


// 1. Moderator, 2. user who created post, 3. user who made the comment can access
const commentAccess = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
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

        let foundFlag: boolean = await req.loggedInUser?._id.equals(post.userId);
        if (foundFlag) {
            next();
            return;
        }

        const getCommentResponse = await commentsDAL.getSingleCommentById(req.body.commentId);
        if (getCommentResponse.isError) throw getCommentResponse;

        foundFlag = await req.loggedInUser?._id.equals(getCommentResponse.comment?.commentedByUser);
        if(!foundFlag) throw Error("You Do Not Have Access For This Comment");

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

export default commentAccess;