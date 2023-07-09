import authenticateToken from './authenticateToken.mw';
import validateUser from './validation/validateUser.mw'
import validateLogin from './validation/validateLogin.mw';
import validateComment from './validation/validateComments.mw';
import verifyReqParams from './verifyReqParams.mw';
import checkBlocked from './checkBlocked.mw';
import validatePost from './validation/validatePost.mw';
import verifyPostAccess from './verifyPostAccess.mw';
import verifyPostCreator from './verifyPostCreator.mw';
import accessSuccessfulPayment from './accessSuccessfulPayment.mw';
import accessSocialFeed from './accessSocialFeed.mw';
import commentAccess from './commentAccess.mw';

export {
    authenticateToken, verifyReqParams, verifyPostAccess, checkBlocked, verifyPostCreator,
    validateUser, validateLogin, validatePost, validateComment, accessSuccessfulPayment,
    accessSocialFeed, commentAccess
};