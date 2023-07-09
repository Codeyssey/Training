import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete'

interface IPost {
    userId: any,
    desc?: string,
    img?: string,
    likes?: Array<mongoose.Types.ObjectId>,
    comments?: Array<mongoose.Types.ObjectId>
};

interface IPostDoc extends IPost, SoftDeleteDocument {
    createdAt: Date;
    updatedAt: Date;
}


export { IPost, IPostDoc };