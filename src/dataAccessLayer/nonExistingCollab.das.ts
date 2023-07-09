import Tasks from '../models/task.model';
import nonExistingCollab from '../models/nonExistingCollab.model';
import mongoose from 'mongoose';

const collabs_DataLayer = {
    save_ne_collab: async(payload:object): Promise<any> => {
        let collab = new nonExistingCollab(payload);
        return await collab.save();
    },
    getAllTasks: async(email: string) => {
        const alltaskResult = await nonExistingCollab.find( {email: email} );
        return alltaskResult;
    },
    deleteEntry: async(id: mongoose.Types.ObjectId) => {
        let taskDeleted = await nonExistingCollab.deleteOne({ _id: id });
        return taskDeleted;
    }
}

export default collabs_DataLayer;