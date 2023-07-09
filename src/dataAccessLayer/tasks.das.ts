import Tasks from '../models/task.model';
import nonExistingCollab from '../models/nonExistingCollab.model';
import mongoose from 'mongoose';

const tasks_DataLayer = {
    saveTask: async(payload:object): Promise<any> => {
        let task = new Tasks(payload);
        return await task.save();
    },
    getAllUserTasks: async (userId: string): Promise<any> => {
        const userTasks = await Tasks.find( { userAccount: userId } );
        return userTasks;
    },
    deleteUserTask: async (taskId: mongoose.Types.ObjectId): Promise<any> => {
        let taskDeleted = await Tasks.deleteOne({ _id: taskId });
        return taskDeleted;
    },
    is_taskExist: async (taskId: mongoose.Types.ObjectId): Promise<any> => {
        const task_exist = await Tasks.findById(taskId);
        return task_exist;
    },
    editTask: async (taskId: mongoose.Types.ObjectId, update_payload: object) => {
        const update = await Tasks.findByIdAndUpdate(taskId, update_payload, { useFindAndModify: false })
        return update;
    }
}

export default tasks_DataLayer;