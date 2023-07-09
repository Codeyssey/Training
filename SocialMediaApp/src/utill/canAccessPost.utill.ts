import mongoose from "mongoose";
import { IUserDoc, IPostDoc } from "../interface/index.interface";
import { userService } from "../services/index.service";

const canAccessPost = async (user: IUserDoc, post: IPostDoc) => {
    try{
        // If user acc not == logged in user then you have access to this post and you can move on
        if (user._id.equals(post.userId)) return true;
        // If not then ->
        // Get the user document that created/posted this specific post
        const getUserResponse = await userService.getUserById(post.userId);
        if(getUserResponse.isError) throw getUserResponse;
        // A cautionary check will never be true
        if(!getUserResponse.user || getUserResponse.user === null) throw Error();
        // get all the followers of that particular user
        // if any follower === logged in user then ok else error
        return await getUserResponse.user.followers?.some(
            (e: mongoose.Types.ObjectId) => e.equals(user._id)
        );
    }catch(err){
        return false;
    }
}

export default canAccessPost;