import express from 'express';
import { authenticateToken, checkBlocked, verifyReqParams,
    verifyPostAccess, commentAccess, validateComment, verifyPostCreator } from '../middleWare/index.mw';
import { commentControllers } from '../controllers/index.controllers';

const commentRouter = express.Router();

// Get all replies of a comment
//TODO: Add pagination here
commentRouter.get('/:userId/posts/:postId/getCommentAndItsReplies', authenticateToken, verifyReqParams,
                    verifyPostAccess, commentControllers.getCommentAndReplies);
// Add a comment
commentRouter.post('/:userId/posts/:postId/addComment', authenticateToken, verifyReqParams,
                    verifyPostAccess, validateComment, commentControllers.addComment );
// Delete a comment
commentRouter.delete('/:userId/posts/:postId/deleteComment', authenticateToken, verifyReqParams,
                    commentAccess, commentControllers.deleteComment );

export default commentRouter;