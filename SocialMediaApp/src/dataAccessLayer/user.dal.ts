import { any } from 'joi';
import mongoose from 'mongoose';
import { IUserDoc, IError } from "../interface/index.interface";
import Users from "./models/users.model";

interface IUserDal {
    createUser:  (payload: IUserDoc | object) => Promise<any>;
    uniqueEmailCheck:  (email: string) => Promise<any>;
    uniqueUserNameCheck:  (userName: string) => Promise<any>;
    getUserByEmail: (email: string) => Promise<any>;
    getUserById: (id: mongoose.Types.ObjectId | string) => Promise<any>;
    updateUser:  (id: mongoose.Types.ObjectId | string, payload: object ) => Promise<any>;
    delete: (id: mongoose.Types.ObjectId | string) => Promise<any>;
};

const usersDAL: IUserDal = {
    //* add user in database users collection
    createUser: async (payload: IUserDoc | object) => {
        try{
            // Make a document for this user
            const newUser: IUserDoc = new Users(payload);
            // Save this document in the database
            await newUser.save();
            // Return to service
            return {
                isError: false,
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: "Unexpected Database Error Occured: Could Not Save User",
                status: 500, // Internal Server Error
                stage: "Save User Data Access Layer"
            }
        }
    },
    //* checks if email is unique or not
    uniqueEmailCheck: async (email: string) => {
        var user: IUserDoc | null = null;
        try{
            user = await Users.findOne({ email: email });
            if( user ) throw {
                message: "A User With This Email Already Exists",
                status: 409 // Conflict Status Code
            };
            return {
                isError: false,
            }
        }catch(err: IError  | any){
            return {
                isError: true,
                message: err.message || "Unexpected Database Error Occured: Could Not Check If User With Same Email Already Exists",
                status: err.status || 500, // Internal Server Error
                stage: "Unique Email Check Data Access Layer"
            }
        }
    },
    //* checks if username is unique or not
    uniqueUserNameCheck: async (userName: string) => {
        var user: IUserDoc | null = null;
        try{
            user = await Users.findOne({ userName: userName });
            if( user ) throw {
                message: "A User With This User Name Already Exists",
                status: 409 // Conflict Status Code
            };
            return {
                isError: false,
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "Unexpected Database Error Occured: Could Not Check If User With Same Username Already Exists",
                status: err.status || 500, // Internal Server Error
                stage: "Unique Username Check Data Access Layer"
            }
        }
    },
    //* gets a user document where email matches
    getUserByEmail: async(email: string) => {
        try{
            const user = await Users.findOne( { email: email } );
            if(!user) throw Error("No User With The Specified Email Found");
            return {
                isError: false,
                user: user
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "DataBase Error: Could Not Retrieve User",
                status: 500, // Internal Server Error
                stage: "Get Email Data Access Layer"
            }
        }
    },
    getUserById: async(id: mongoose.Types.ObjectId | string) => {
        try{
            const user = await Users.findById(id);
            if(!user) throw Error("No User With This User ID");
            return {
                isError: false,
                user: user
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "DataBase Error: Could Not Retrieve User With This Id",
                status: 500 // Internal Server Error
            }
        }
    },
    // * Updates users details
    updateUser: async (id: mongoose.Types.ObjectId | string, payload: object ) => {
        try{
            const update = await Users.findByIdAndUpdate(id, payload, { useFindAndModify: false });
            return {
                isError: false,
                update: update
            };
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "DataBase Error: Could Not Update User",
                status: 500, // Internal Server Error
                stage: "User Data Access Layer"
            }
        }
    },
    //* Delete User
    delete: async (id: mongoose.Types.ObjectId | string) => {
        try{
            await Users.delete( { _id: id } );
            return {
                isError: false,
            }
        }catch(err: IError | any){
            return {
                isError: true,
                message: err.message || "DataBase Error: Could Not Delete User",
                status: 500, // Internal Server Error
                stage: "User Data Access Layer"
            }
        }
    }
}

export default usersDAL;