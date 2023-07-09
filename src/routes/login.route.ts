import express from 'express';
import { login } from '../controllers/login.controller';
import validateLoginReq from '../middleWare/validateLogin.middleware';

const router = express.Router();

export default router.post('/', validateLoginReq, login);