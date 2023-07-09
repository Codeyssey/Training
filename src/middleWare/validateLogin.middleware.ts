import * as express from 'express';
import joi from 'joi';

const loginSchema = joi.object({
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
    password: joi
                .string()
                .required()
                .regex(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})" ) )
                .messages({
                    'string.base': '{{#label}} must be a string',
                    "any.required": "{{#label}} is required!!",
                    "string.empty": "{{#label}} can't be empty!!",
                    'string.pattern.base': '{{#label}} is Incorrect !',
                }),
})

const validateLoginReq = async (req: express.Request, res:express.Response, next: express.NextFunction) => {
    try{
        let session = req.session;
        const payload = {
            email: req.body.email,
            password: req.body.password
        }
        // Check if payload is valid
        const {error, value} = loginSchema.validate(payload);
        if (error) throw error;
        res.locals.payload = payload;
        next();
    }catch(err: any){
        res
        .status(400)
        .json({
            message: "Failed to validate the login request, username or password is in wrong format",
            error: err.message
        })
    }
}

export default validateLoginReq;