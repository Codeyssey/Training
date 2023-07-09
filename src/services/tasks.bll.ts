import mongoose from "mongoose";
import tasks_DataLayer from "../dataAccessLayer/tasks.das";
// TODO Assign type to tasks BLL and change return of Promise<any>

interface IUserMethods {
    addTaskBLL: (payload: object) => Promise<any>,
    getAllUserTasks:  (userId: string) => Promise<any>,
    deleteTask:  (taskId: mongoose.Types.ObjectId) => Promise<any>,
    is_taskExists:  (taskId: mongoose.Types.ObjectId, logged_inUser: string) => Promise<any>,
    editTask: (taskId: mongoose.Types.ObjectId, update_payload: object) => Promise<any>
}
const tasks_BusinessLogic: IUserMethods = {
    addTaskBLL: async(payload: object): Promise<any> => {
        const taskSave_result = await tasks_DataLayer.saveTask(payload);
        return taskSave_result;
    },
    getAllUserTasks: async (userId: string): Promise<any> => {
        const tasks = await tasks_DataLayer.getAllUserTasks(userId);
        return tasks;
    },
    deleteTask: async (taskId: mongoose.Types.ObjectId): Promise<any> => {
        const deletedTask = await tasks_DataLayer.deleteUserTask(taskId);
        return deletedTask;
    },
    is_taskExists: async (taskId: mongoose.Types.ObjectId, logged_inUser: string) => {
        const task = await tasks_DataLayer.is_taskExist(taskId);
        if (task) {
            const userId: string = task.userAccount;
            const collaboratorId: string = task.collaborator;
            if (logged_inUser !== userId || logged_inUser !== collaboratorId) {
                return {
                    isError: true,
                    statusCode: 401,
                    message: "Can not Access other users tasks"
                }
            }
        } else {
            return {
                isError: true,
                statusCode: 400,
                message: `Task with id ${taskId} does not exists.`
            }
        }
        return {
            isError: false,
            task: task
        };
    },
    editTask: async(taskId: mongoose.Types.ObjectId, update_payload: object)=>{
        const updatedTask = await tasks_DataLayer.editTask(taskId, update_payload);
        return updatedTask;
    }
};

export default tasks_BusinessLogic;