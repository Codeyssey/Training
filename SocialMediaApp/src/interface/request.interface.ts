import express from 'express';
import { IUserDoc, IPost } from './index.interface';

interface IRequest extends express.Request {
    payload?: any,
    loggedInUser?: IUserDoc,
    requestedUser?: IUserDoc,
    post?: IPost
};

export default IRequest;