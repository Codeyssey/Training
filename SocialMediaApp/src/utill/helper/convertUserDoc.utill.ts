import { IUserDoc } from "../../interface/user.interface"

// To convert the mongoose document into a plain user object besides converting mongoose id to userDoc.
const convertDocumentToObj = (userDoc: IUserDoc) => {
    const plainObj = {
        _id: userDoc._id,
        userName: userDoc.userName,
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        dob: userDoc.dob,
        gender: userDoc.gender,
        password: userDoc.password,
        profilePicture: userDoc.profilePicture,
        bio: userDoc.bio,
        followers: userDoc.followers,
        following: userDoc.following,
        blockedList: userDoc.blockedList,
        posts: userDoc.posts,
        moderator:userDoc.moderator
    }
    return plainObj;
}

export default convertDocumentToObj