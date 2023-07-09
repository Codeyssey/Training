import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { boolean } from 'joi';
import { IUserDoc } from '../../interface/index.interface';
import MongooseDelete from 'mongoose-delete';

const userSchema: Schema<IUserDoc> = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, 'Please enter a username'],
            min: 3,
            max:20,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, 'Please enter an email'],
            unique: true,
            lowercase: true,
        },
        firstName: {
            type: String,
            required: [true, 'Please enter your firstname'],
        },
        lastName: String,
        dob: {
            type: Date,
            required: [true, 'Please enter your date of birth']
        },
        gender: {
            type: String,
            required: [true, 'Please enter your gender']
        },
        password: {
            type: String,
            min: 8,
            required: [true, 'Please enter a password'],
        },
        profilePicture: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: ""
        },
        followers: {
            type: Array,
            default: [],
            ref: "users"
        },
        followings: {
            type: Array,
            default: [],
            ref: "users"
        },
        blockedList: {
            type: Array,
            default: [],
            ref: "users"
        },
        moderator:{
            type: Boolean,
            default: false
        },
        paid:{
            type: String,
            default: "Not"
        },
    },
    { timestamps: true }
);

// Virtual method
userSchema.virtual("fullName").get(function (this: IUserDoc) {
    return `${this.firstName} ${this.lastName}`;
})

// When the user registers
userSchema.pre("save", async function(this: IUserDoc, next){
    try{
        // Hashing the pw before saving it to the db
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hashSync(this.password, salt);
        this.password = hash;
        return next();
    }catch(err: any){
        return next(err);
    }
});

userSchema.plugin(MongooseDelete, {
    deletedBy: true,
    deletedAt : true,
    overrideMethods: 'all'
})

export default mongoose.model<IUserDoc>("users", userSchema) as MongooseDelete.SoftDeleteModel<IUserDoc>;