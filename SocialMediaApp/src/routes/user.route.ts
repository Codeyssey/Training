import express from 'express';
import { authenticateToken, checkBlocked,
    validateUser, validateLogin, verifyReqParams,
    accessSuccessfulPayment } from '../middleWare/index.mw';
import { userControllers } from '../controllers/index.controllers';

const userRouter = express.Router();
//* Register/Create a user
userRouter.post('/users/register', validateUser, userControllers.registerUser);
//* Login User route
userRouter.post('/users/login', validateLogin, userControllers.loginUser);
//* Follow a user
userRouter.put('/users/:userId/follow', authenticateToken, verifyReqParams,
                            checkBlocked, userControllers.followUser);
//* Unfollow a user
userRouter.put('/users/:userId/unfollow', authenticateToken, verifyReqParams,
                                checkBlocked, userControllers.unfollowUser);
// ! Add user to blocklist
// ! Remove user from blocklist

//* Make User a moderator -> Only moderators can access this route
userRouter.post('/users/:userId/makeModerator', authenticateToken, verifyReqParams,
                    userControllers.makeModerator);
// Delete a user -> cascade delete with posts
userRouter.delete('/users/:userId/delete', authenticateToken, verifyReqParams, userControllers.delete);
// Edit a user
//TODO: Make Sure the update body does not have values that a user can not update
//TODO: Add DOB update checks here too and if they want to change email etc
//TODO: Send verified payload from this middleware to the controller then
userRouter.put('/users/:userId/edit', authenticateToken, verifyReqParams,
                    userControllers.update );

//* Stripe paywall
//* Create stripe checkout session
userRouter.post('/users/:userId/stripe-payment',
            authenticateToken, verifyReqParams,
            userControllers.paymentCheckoutSession
        );
// Make sure that user can only access this when the payment is pending
//? Scenario: User creates a checkout session, payment marked as pending
//? If user access this route without actually paying how can I verify that this user is
//? authorized to access this link
userRouter.get('/:userId/socialfeedPayment-success',
    accessSuccessfulPayment, userControllers.markAsPaidUser);

export default userRouter;