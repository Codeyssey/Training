// Server side configuration
import * as dotenv from 'dotenv';
import express from 'express';
import cors, { CorsOptions } from "cors";
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// Socket Imports
import { createServer } from "http";
import { Server } from "socket.io";
import { getLoggedInUsers } from '../utill/getLoggedInUsers'
dotenv.config();
// Verifying if port is set in .env
if (!process.env.PORT) {
    console.log("ERROR: Port Number Not Set");
    process.exit(1);
}

// App Variables
const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
const corsOptions: CorsOptions = {
   origin: `http://localhost:${PORT}`,
   methods: "HEAD, PUT, PATCH, POST, DELETE",
}
//  App Configuration
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Socket Server
const server = createServer(app);
const io = new Server(server);
// Run when client connects
io.on('connection', socket => {
    console.log("New User Connected: ", socket.id);
    // When a user successfully registers
    socket.on('create-room', userID => {
        console.log('Creating Room: ', userID);
        socket.join(userID);
    });
    // When a user follows -> (Maintaining Array here only to make postman testing easier)
    // Similar to create-room doing this just for my clarity
    socket.on('join-room', (followingIds: Array<string>) => {
        followingIds.forEach( (id: string) => {
            console.log('Joining Room: ', id);
            socket.join(id);
        });
    });
    // When a user unfollows
    socket.on('leave-room', (unfollowUserId: string) => {
        console.log('Leaving Room: ', unfollowUserId);
        socket.leave(unfollowUserId);
    })
});


export { io, app, server };