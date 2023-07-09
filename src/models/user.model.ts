import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import IUserDoc from "../interface/user.interface";
// TODO: Remove Helping functions here and put them in the util module

const userSchema: Schema<IUserDoc> = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        // validate: [isEmail, 'Please enter a valid email']
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: String,
    password: {
        type: String,
        required: true,
    },
});

// Virtual method
userSchema.virtual("fullName").get(function (this: IUserDoc) {
    return `${this.firstName} ${this.lastName}`;
})

// When the user registers
userSchema.pre("save", async function(this: IUserDoc, next){
    try{
        // Hashing the pw before saving it to the db
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hashSync(this.password, salt);
        this.password = hash;
        return next();
    }catch(err: any){
        return next(err);
    }
});

// Check if pw for login is correct
userSchema.methods.checkPW = async function (pw: string){
    return await bcrypt.compare(pw, this.password);
}

export default mongoose.model<IUserDoc>("users", userSchema);