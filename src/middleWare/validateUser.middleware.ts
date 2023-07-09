import joi from 'joi';
import users from '../models/user.model';
import express from "express";

const schema = joi.object({
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
})

const validateUser = async (req: express.Request, res:express.Response, next: express.NextFunction) => {
    try{
        const payload = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        };
        // Check if payload is valid
        const {error, value} = schema.validate(payload);
        if (error) throw error;
        res.locals.payload = payload;
        next();
    }catch(err: any){
        res
        .status(400)
        .json({
            message: "Failed To Register, User Information Is Not Valid",
            error: err.message
        })
    }
};

export default validateUser;