import express from 'express';
import { register } from '../controllers/register.controller';
import validateUser from '../middleWare/validateUser.middleware';

const router = express.Router();

export default router.post('/', validateUser, register);