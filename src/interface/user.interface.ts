import mongoose from "mongoose";

interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

interface IUserDoc extends IUser, mongoose.Document {
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    checkPW: (pw: string) => boolean
}

export default IUserDoc;