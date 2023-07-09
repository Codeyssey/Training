import { any } from "joi";
import mongoose, { Schema } from "mongoose";
import Users from './user.model';

// interface ITasks {
//     text: string;
//     dueDate: Date;
//     status: string;
//     createdAt: Date;
//     updatedAt: Date;
//     userAccount: Users;
//     createdAt: Date;
// }

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'No Task Has Been Entered']
    },
    dueDate: {
        type: Date,
        required: [true, 'Select A Due Date']
    },
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    userAccount: {
        type: String,
        ref: Users, 
        required: [true, 'Not Assigned A User']
    },
    collaborator: {
        type: String,
        ref: Users
    }
});

export default mongoose.model("tasks", taskSchema);
