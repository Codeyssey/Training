/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import bodyParser from 'body-parser';

import mongoConnection from './config/db';
import registerRoute from './routes/register.route';
import loginRoute from './routes/login.route';
import taskRoute from './routes/tasks.route';
// import sessionMiddleware from './middlewares/session.middleware'
dotenv.config();
/**
 * App Variables
 */
if (!process.env.PORT) {
    console.log("ERROR: Port Number Not Set");
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

declare module 'express-session' {
    interface SessionData {
      userID: string;
      isAuth: boolean
    }
}
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 *  60 * 60 * 24 * 7 // 7days
    }
}));
/**
 * Connection to DB and Server Activation
 */
mongoConnection((client: any) => {
    app.listen(PORT, () => {
        // console.log(`\nMONGO CLIENT: \n${client}\n`)
        console.log(`\nServer Activated\nListening on port ${PORT} ! \n`);
    });
});
/**
 * Middlewares
 */
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/:id', taskRoute);

