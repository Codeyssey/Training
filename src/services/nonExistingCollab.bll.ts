import mongoose from "mongoose";
import collabs_DataLayer from "../dataAccessLayer/nonExistingCollab.das";

const collabs_BusinessLogic = {
    saveNonExistingCollab: async(payload: object): Promise<any> => {
        // TODO: Unique Check On Task ID AND user Email
        const taskSave_result = await collabs_DataLayer.save_ne_collab(payload);
        return taskSave_result;
    },
    findCollab: async(email: string) => {
        const allEntries = await collabs_DataLayer.getAllTasks(email);
        return allEntries;
    },
    deleteEntry: async (id: mongoose.Types.ObjectId): Promise<any> => {
        const deletedTask = await collabs_DataLayer.deleteEntry(id);
        return deletedTask;
    },
};

export default collabs_BusinessLogic;