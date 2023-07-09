import express from 'express';
import { authenticateToken, checkBlocked, verifyReqParams,
    verifyPostAccess, validatePost, accessSocialFeed, verifyPostCreator } from '../middleWare/index.mw';
import postControllers from '../controllers/post.controller';

const postRouter = express.Router();
//! Get all users posts

//* Create a post
postRouter.post('/:userId/posts/create',  authenticateToken, verifyReqParams,
                    validatePost, postControllers.create);
//* Delete a post -> Cascade delete with comments
postRouter.delete('/:userId/posts/:postId/delete', authenticateToken, verifyReqParams,
                    verifyPostCreator, postControllers.delete);
// Edit a post -> can only edit its text/body -> make sure only the creator of the post can access this route
postRouter.post('/:userId/posts/:postId/edit',  authenticateToken, verifyReqParams,
                    verifyPostCreator, postControllers.update);
//* Like a post
postRouter.put('/:userId/posts/:postId/like',  authenticateToken, verifyReqParams,
                    verifyPostAccess, postControllers.like);
//* Unlike a post
postRouter.put('/:userId/posts/:postId/like',  authenticateToken, verifyReqParams,
                    verifyPostAccess, postControllers.unlike);


//! Get all comments of a post -> return all the comments from post comments array
// postRouter.get('/:userId/posts/:postId/getComments')

//* User Feed Posts
postRouter.get('/:userId/feed', authenticateToken, verifyReqParams,
                    accessSocialFeed, postControllers.showFeed);

export default postRouter;