//* Finalized
import joi from 'joi';
import express from 'express';
import { IPost, IError, IRequest } from '../../interface/index.interface';

const postSchema = joi.object({
    userId: joi
            .any()
            .required()
            .messages({
                "any.required": "{{#label}} is required!!",
            }),
    desc: joi
            .string()
            .messages({
                'string.base': '{{#label}} must be a string',
            }),
    img: joi
            .string()
            .messages({
                'string.base': '{{#label}} must be a string',
            })
})

const validatePost = async (req: IRequest, res:express.Response, next: express.NextFunction) => {
    try{
        // Make sure either the post has a text or an image
        if ( ( !req.body.desc || req.body.desc === "")
            && (!req.body.img || req.body.img === "" ) ) throw Error("Can Not Post An Empty Post")
        // Validating the request body to add a post
        const payload: IPost = {
            userId: req.loggedInUser,
            desc: req.body.desc,
            img: req.body.img,
        }
        const {error, value} = postSchema.validate(payload);
        if (error) throw error;
        req.payload = payload;
        next();
    }catch(err: IError | any){
        res
        .status(400) // Bad Request
        .json({
            Error: true,
            stage: "Post Validation",
            message: err.message || "Failed To Add Task, Task Information Is Not Valid",
        });
    }
}

export default validatePost;