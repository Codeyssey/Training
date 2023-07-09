// * Finalized
import joi from 'joi';
import express from "express";
import { IUser, IRequest, IError } from '../../interface/index.interface';

const now = Date.now();
const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 18));                        // Making Sure User Is Older Than 18

const schema = joi.object({
    userName: joi
                .string()
                .required()
                .lowercase()
                .max(20)
                .messages({
                    'string.base': '{{#label}} must be a string',
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "{{#label}} can't be empty!!",
                }),
    email: joi
            .string()
            .required()
            .regex(new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}"))
            .lowercase()
            .messages({
                'string.base': '{{#label}} must be a string',
                "any.required": "{{#label}} is required!!",
                "string.empty": "{{#label}} can't be empty!!",
                'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern for email',
            }),
    firstName: joi
                .string()
                .required()
                .messages({
                    'string.base': '{{#label}} must be a string',
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "{{#label}} can't be empty!!",
                }),
    lastName: joi.string(),
    dob: joi
          .date()
          .max(cutoffDate)
          .required()
          .messages({
            'date.base': '{{#label}} must be a Date',
            "any.required": "{{#label}} is required!!",
          }),
    gender: joi
             .string()
             .valid('male', 'female', 'other')
             .messages({
                'string.base': '{{#label}} must be a string',
                "any.required": "{{#label}} is required!!",
                "string.empty": "{{#label}} can't be empty!!",
            }),
    password: joi
                .string()
                .required()
                .regex(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})" ) )
                .messages({
                    'string.base': '{{#label}} must be a string',
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "{{#label}} can't be empty!!",
                    'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
                }),
    profilePicture: joi.string(),
    bio: joi.string(),
    moderator: joi.boolean(),
    paid: joi.string(),
})

const validateUser = async (req: IRequest, res:express.Response, next: express.NextFunction) => {
    try{
        const payload: IUser = {
            userName: req.body.userName,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
            gender: req.body.gender,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
            bio: req.body.bio,
            moderator: req.body.moderator || false,
            paid: "Not",
        };
        // Check if payload is valid
        const {error, value} = schema.validate(payload);
        if (error) throw error;
        req.payload = payload;
        next();
    }catch(err: IError | any){
        res
        .status(400)
        .json({
            Error: true,
            message: "Failed To Register, User Information Is Not Valid",
            error: err.message,
            stage: "Failed at validate user middleware"
        })
    }
};

export default validateUser;