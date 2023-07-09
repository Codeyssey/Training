import mongoose from "mongoose";
import users_DataAccessLayer from "../dataAccessLayer/users.das";
import collabs_BusinessLogic from '../services/nonExistingCollab.bll';
import tasks_BusinessLogic from "./tasks.bll";


const users_BusinessLogicLayer = {
    authentiavte_login: async(email: string, password: string) => {
        const findResult = await users_DataAccessLayer.getUser(email);
        if (findResult.isError){
            return {
                isAuthenticated: false,
                message: "No User Is Registered With This Email"
            }
        }
        const validate = await users_DataAccessLayer.validatePW(findResult.user, password);
        if (validate.isError){
            return {
                isAuthenticated: false,
                message: validate.message
            }
        }
        return {
            isAuthenticated: true,
            message: `User Logged In Successfully, Welcome ${findResult.user?.firstName}`,
            user: findResult.user
        }
    },
    verifyEmail: async (email: string) => {
        const verificationResult = await users_DataAccessLayer.uniqueEmailCheck(email);
        return verificationResult;
    },
    addNewUser: async(payload: any) => {
        try{
            const verificationResult = await users_DataAccessLayer.uniqueEmailCheck(payload.email);
            if ( !verificationResult.isUnique ) throw Error(verificationResult.message);
            const savedUser = await users_DataAccessLayer.saveUser(payload);
            // Search if user registering exist in nonExisting Collab
            const findCollaborations = await collabs_BusinessLogic.findCollab(payload.email as string);
            // If not found any entry then return
            if(!findCollaborations){
                return {
                    save: true,
                    user: savedUser,
                    message: "User Registered Successfully"
                }
            }
            // If Found remove that entry from the collection and assign this user the task
            findCollaborations.forEach( async (entry: any) => {
                const taskID = new mongoose.Types.ObjectId(entry.assigned_taskID as string);
                // Edit task and add the user as a collaborator in the task
                const collabpayload = {
                    collaborator: savedUser._id as string
                }
                const updated_task = await tasks_BusinessLogic.editTask(taskID, collabpayload);
                // Remove this entry from the non existing collab collection
                const delete_response = await collabs_BusinessLogic.deleteEntry(entry._id);
            });
            return {
                save: true,
                user: savedUser,
                message: "User Registered Successfully And Has Been Assigned As Collaborator In Tasks"
            }
        }catch(err: any){
            return {
                save: false,
                message: err.message
            }
        }

    }
}

export default users_BusinessLogicLayer;