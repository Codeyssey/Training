import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete'

interface IUser {
    userName: string,
    email: string;
    firstName: string;
    lastName: string;
    dob: Date;
    gender: string;
    password: string;
    profilePicture?: string,
    bio?: string,

    followers?: Array<mongoose.Types.ObjectId>,
    followings?: Array<mongoose.Types.ObjectId>,
    blockedList?: Array<mongoose.Types.ObjectId>,

    moderator: boolean;
    paid: string;
}

interface IUserDoc extends IUser, SoftDeleteDocument {
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    checkPW: (pw: string) => boolean
}

interface IUserPlainObj {
    _id: mongoose.Types.ObjectId;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: Date;
    gender: string;
    password: string;

    profilePicture?: string;
    bio?: string;
    followers?: Array<mongoose.Types.ObjectId>;
    followings?: Array<mongoose.Types.ObjectId>;
    blockedList?: Array<mongoose.Types.ObjectId>;

    moderator:boolean;
    paid: string;
}

export { IUser, IUserDoc, IUserPlainObj };