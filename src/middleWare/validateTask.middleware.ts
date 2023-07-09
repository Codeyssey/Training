import joi from 'joi';
import express from 'express';

// TODO: Add Task Title

const taskSchema = joi.object({
    text: joi
            .string()
            .required()
            .messages({
                'string.base': '{{#label}} must be a string',
                "any.required": "{{#label}} is required!!",
                "string.empty": "{{#label}} can't be empty!!",
            }),
    dueDate: joi
                .date()
                .greater(Date.now())
                .required()
                .messages({
                    'date.base': '{{#label}} must be a date',
                    "any.required": "{{#label}} is required!!",
                }),
    status: joi.string(),
    createdAt: joi.date(),
    updatedAt: joi.date(),
    userAccount: joi.any()
})

const validateTask = async (req: express.Request, res:express.Response, next: express.NextFunction) => {
    try{
         // Validating the request body to add task
        const payload = {
            text: req.body.text,
            dueDate: req.body.dueDate,
            status: req.body.status || "pending",
            userAccount: String( res.locals.user._id)
        }
        const {error, value} = taskSchema.validate(payload);
        if (error) throw error;
        res.locals.payload = payload;
        next();
    }catch(err: any){
        res
        .status(400) // Bad Request
        .json({
            message: "Failed To Add Task, Task Information Is Not Valid",
            error: err.message
        });
    }
}

export default validateTask;