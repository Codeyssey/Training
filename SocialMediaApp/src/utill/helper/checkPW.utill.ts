import bcrypt from "bcrypt";

// Check if pw for login is correct
const checkPW = async function (pw: string, accPW: string){
    return await bcrypt.compare(pw, accPW);
}

export default checkPW;