import mongoose, { Schema } from "mongoose";
import MongooseDelete from 'mongoose-delete';

import { ICommentDoc } from "../../interface/index.interface";

const commentSchema: Schema<ICommentDoc> = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts"
        },
        body: {
            type: String,
            max: 250
        },
        root: {
            type: Boolean,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments"
        },
        commentedByUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    },
    { timestamps: true }
);

commentSchema.plugin(MongooseDelete, {
    deletedBy: true,
    deletedAt : true,
    overrideMethods: 'all'
});

const Comments = mongoose.model<ICommentDoc>("comments", commentSchema) as MongooseDelete.SoftDeleteModel<ICommentDoc>;

export { commentSchema, Comments };