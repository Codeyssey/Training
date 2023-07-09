import * as express from 'express';
import joi from 'joi';

const emailSchema = joi.object({
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
            })
})

const validateEmail = async (req: express.Request, res:express.Response, next: express.NextFunction) => {
    try{
        const payload = {
            email: req.body.email
        }
        // Check if payload is valid
        const {error, value} = emailSchema.validate(payload);
        if (error) throw error;
        res.locals.payload = payload;
        next();
    }catch(err: any){
        console.log("NOT VALID")
        res
        .status(400)
        .json({
            message: "Invalid Email Address",
            error: err.message
        })
    }
}

export default validateEmail;