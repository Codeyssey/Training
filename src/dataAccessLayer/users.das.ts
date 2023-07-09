import Users from '../models/user.model';
import IUserDoc from "../interface/user.interface";

// TODO: Fix user: any in validate pw and save user methods

const users_DataAccessLayer = {
    getUser: async(email: string) => {
        const user = await Users.findOne( { email: email } )
        if(!user){
            return {
                isError: true
            }
        }
        return {
            isError: false,
            user: user
        }
    },
    validatePW: async(user: any, password: string) => {
        if ( await user.checkPW(password) ){
            // req.session.userID = String(user._id);
            return {
                isError: false
            }
        }
        return {
            isError: true,
            message: "Failed To Login Incorrect Password"
        }
    },
    uniqueEmailCheck: async (email: string) => {
        var user: IUserDoc | null = null;
        try{
            user = await Users.findOne({ email: email });
            if( user ) throw new Error("A User With This Email Already Exists");
            return {
                isUnique: true,
            }
        }catch(err: any){
            return {
                isUnique: false,
                message: err.message,
                found_user: user
            }
        }
    },
    saveUser: async (payload: object) => {
        const newUser = new Users(payload);
        return await newUser.save();
    }
}

export default users_DataAccessLayer;