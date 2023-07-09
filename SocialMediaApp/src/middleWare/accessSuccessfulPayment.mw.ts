//* Finalized
import * as express from 'express';
import { userService } from '../services/index.service';
import { IRequest } from '../interface/index.interface';

const accessSuccessfulPayment = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try{
        const getUserResponse = await userService.getUserById(req.params.userId);
        if (getUserResponse.isError) throw getUserResponse;
        if (getUserResponse.user?.paid === 'Not') throw Error("User Has Not Created A Checkout Session");

        next();
    }catch(err: any){
        return res
        .status(401)
        .json({
            stage: "Authorize Success Payment Access",
            message: err.message || "An Unexpected Error Occured",
            Error: true
        })
    }
}

export default accessSuccessfulPayment;