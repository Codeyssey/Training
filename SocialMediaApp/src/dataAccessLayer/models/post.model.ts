import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { boolean } from "joi";
import { IPostDoc } from "../../interface/index.interface";
import MongooseDelete from "mongoose-delete";

const postSchema: Schema<IPostDoc> = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Please enter a username'],
            ref: "users"
        },
        desc: {
            type: String,
            max: 500
        },
        img: {
            type: String
        },
        likes: {
            type: Array,
            default: [],
            ref: "users"
        },
        comments: {
            type: Array,
            default: [],
            ref: "comments"
        }
    },
    { timestamps: true }
);

postSchema.plugin(MongooseDelete, {
    deletedBy: true,
    deletedAt : true,
    overrideMethods: 'all'
});


export default mongoose.model<IPostDoc>("posts", postSchema) as MongooseDelete.SoftDeleteModel<IPostDoc>;