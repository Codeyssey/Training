
import * as express from 'express';
import mongoose from 'mongoose';
import tasks_BusinessLogic from "../services/tasks.bll";
import users_BusinessLogicLayer from '../services/users.bll';
import collabs_BusinessLogic from '../services/nonExistingCollab.bll';
import emailSender from '../utill/helpers/services/mail.utils';
// TODO : When the due date arrives mark status as completed
// TODO : Wrap getUser Method in decorator and if the session id has not been updated then return the already retrieved user
// TODO : Make Get User as a method
// TODO : Populate user in the task
// TODO : Convert var to const/let
// TODO : Fix/Clean the delete method
// TODO : Fix non existing collab controller move logic to bll
// TODO Check req.params.id and verify correct user is logged in

interface ITaskMethods {
    addTask: (req: express.Request, res:express.Response, next: express.NextFunction) => Promise<void>,
    getTasks: (req: express.Request, res:express.Response, next: express.NextFunction) => Promise<void>,
    deleteTask: (req: express.Request, res:express.Response, next: express.NextFunction) => Promise<void>,
    editTask: (req: express.Request, res:express.Response, next: express.NextFunction) => Promise<void>,
    addCollaborator: (req: express.Request, res:express.Response, next: express.NextFunction) => Promise<void>,
}

let taskMethods: ITaskMethods;

taskMethods = {
    addTask: async (req: express.Request, res:express.Response, next: express.NextFunction) => {
        try{
            // Adding the task to the database
            let task = await tasks_BusinessLogic.addTaskBLL(res.locals.payload);
            res
            .status(201) // Created
            .json({
                message: "Task Added Successfully !",
                task: task
            });
        }catch(err){
            res
            .status(400)
            .send({
                message: "An Error Occured While Adding A Task",
                error: err
            })
        }
    },
    getTasks: async (req: any, res:express.Response, next: express.NextFunction) => {
        try{
            const tasks = await tasks_BusinessLogic.getAllUserTasks(req.session.userID as string);
            res.status(200).json({
                message: "Showing All Tasks For User",
                showTasks: tasks
            })

        }catch(err: any){
            res.status(400).json({
                message: "An Error Occured While Retrieving Data",
                error: err
            })
        }
    },
    deleteTask: async (req: express.Request, res:express.Response, next: express.NextFunction) => {
        try{
            // Check if to be deleted task exists
            const delete_taskID = new mongoose.Types.ObjectId(req.body.id);
            const find_deleteTask = await tasks_BusinessLogic.is_taskExists(delete_taskID, req.session.userID as string)
            if(find_deleteTask.isError){
                res
                .status(find_deleteTask.statusCode as number)
                .json({
                    message: find_deleteTask.message
                })
            }
            // Deleting the task from the list for the found user
            const deleteTask = await tasks_BusinessLogic.deleteTask(delete_taskID);
            res
            .status(200)
            .json({
                message: "Deleted Successfully",
                deletedTask: deleteTask
            })
        }catch(err: any){
            res
            .status(400)
            .json({
                error_message: err.message
            })
        }
    },
    editTask: async (req: express.Request, res:express.Response, next: express.NextFunction) => {
        try{
            // Check to see if the edit task exists
            const toBe_updatedTask_ID = new mongoose.Types.ObjectId(req.params.editTask);
            const find_deleteTask = await tasks_BusinessLogic.is_taskExists(toBe_updatedTask_ID, req.session.userID as string)
            if(find_deleteTask.isError){
                res
                .status(find_deleteTask.statusCode as number)
                .json({
                    message: find_deleteTask.message
                })
            }
            // Edit task
            const updated_task = await tasks_BusinessLogic.editTask(toBe_updatedTask_ID, req.body);
            res
            .status(200)
            .json({
                message: "Task Has Been Updated",
                Update: updated_task
            });
        }catch(err: any){
            console.log(err);
            res
            .status(400)
            .json({
                error_message: err.message
            })
        }
    },
    addCollaborator: async (req: express.Request, res:express.Response, next: express.NextFunction) => {
        try{
            // Send to service and dal to see if the email id exists
            console.log("Email Verifying");
            const user_verification = await users_BusinessLogicLayer.verifyEmail(req.body.email);
            // If the email id exists then assign it as the collaborator -> populate method
            if (!user_verification.isUnique){
                // TODO Verify the same user isnt adding the data
                // Getting the task for the specified id and also verifying if task exists
                const taskID = new mongoose.Types.ObjectId(req.body.id);
                // Edit task and add the user as a collaborator in the task
                const payload = {
                    collaborator: user_verification.found_user?._id as string
                }
                const updated_task = await tasks_BusinessLogic.editTask(taskID, payload);
                res
                .status(200)
                .json({
                    message: "Collaborator Has Been Added",
                    Update: updated_task
                });
                return
            }
            // If user does not exist
            const emailSent = await emailSender(req.body.email);
            if (!emailSent) throw Error("Could Not Send Email");
            // save this email in nonExsitingCollabs model
            const collabPayload = {
                userEmail: req.body.email as string,
                assigned_taskID: req.body.id as string
            }
            let non_existing_collab = await collabs_BusinessLogic.saveNonExistingCollab(collabPayload);
            res
            .status(201) // Created
            .json({
                message: "Email Has Been Sent And Non Existing Collaborator Has Been Marked",
                payload: collabPayload,
                non_existing_collab: non_existing_collab
            });
        }catch(err: any){
            res
            .status(400)
            .json({
                message: "An Error Has Occured",
                error: err.message
            });
        }
    },
}
export default taskMethods;
