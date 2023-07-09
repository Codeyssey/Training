import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete'

interface IComment {
    postId: mongoose.Types.ObjectId,
    body: string,
    root?: boolean,
    parentId?: mongoose.Types.ObjectId,
    commentedByUser: mongoose.Types.ObjectId,
}

interface ICommentDoc extends IComment, SoftDeleteDocument {
    createdAt: Date;
    updatedAt: Date;
}

export { IComment, ICommentDoc };