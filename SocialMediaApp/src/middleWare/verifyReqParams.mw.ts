//* Finalized
import * as express from 'express';
import { IRequest } from '../interface/index.interface';

const verifyReqParams = (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try{
        if(req.params.userId !== req.loggedInUser?._id.toString()){
            throw { message: "Error: Request Parameter contains invalid ID" }
        }
        next();
    }catch(err: any){
        return res
        .status(401)
        .json({
            Error: true,
            stage: "Verify Request Parameter Stage",
            message: err.message || "An Unexpected Error Occured While Verifying Correct User"
        })
    }
}

export default verifyReqParams;