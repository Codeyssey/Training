import joi from 'joi';
import express from 'express';
import { IComment, IRequest, IError } from '../../interface/index.interface';
import mongoose from 'mongoose';

const commentSchema = joi.object({
    postId: joi
            .any()
            .required()
            .messages({
                "any.required": "{{#label}} is required!!",
            }),
    body: joi
            .string()
            .required()
            .messages({
                "any.required": "Can Not Add Empty Comment",
            }),
    root: joi
            .boolean()
            .messages({
                'boolean.base': '{{#label}} must be a boolean',
            }),
    parentId: joi.any(),
    commentedByUser: joi.any()
})

const validateComment = async (req: IRequest, res:express.Response, next: express.NextFunction) => {
    try{
        // Validating the request body to add a post
        const postIdObj = new mongoose.Types.ObjectId(req.params.postId);
        const parentIdObj = req.body.parentId ? new mongoose.Types.ObjectId(req.body.parentId) : undefined;
        const payload: IComment = {
            postId: postIdObj,
            body: req.body.body,
            root: req.body.root || false,
            parentId: parentIdObj,
            commentedByUser: req.loggedInUser?._id
        }
        const {error, value} = commentSchema.validate(payload);
        if (error) throw error;
        req.payload = payload;
        next();
    }catch(err: IError | any){
        res
        .status(400) // Bad Request
        .json({
            Error: true,
            stage: "Comment Validation",
            message: err.message || "Failed To Add Task, Task Information Is Not Valid",
        });
    }
}

export default validateComment;