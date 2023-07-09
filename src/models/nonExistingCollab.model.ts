import { any } from "joi";
import mongoose, { Schema } from "mongoose";
import Users from './user.model';
import Tasks from './task.model';

const nonExistingCollabSchema = new mongoose.Schema({
    userEmail:{
        type: String,
        require: true
    },
    assigned_taskID:{
        type: String,
        require: true,
        ref: Tasks
    }
});

export default mongoose.model("nonExistingCollab", nonExistingCollabSchema);