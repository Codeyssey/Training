// Required External Modules
import * as dotenv from 'dotenv';
import express from 'express';
import fs from "fs";
import morgan from "morgan";
import fileUpload from 'express-fileupload';
// Required Internal Modules
import { io, app, server } from './config/server';
import mongoConnection from './config/database/db.config';
import routes from './routes/index.route';

dotenv.config();
// Verifying if port is set in .env
if (!process.env.PORT) {
    console.log("ERROR: Port Number Not Set");
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
// Logging for APIs
var accessLogStream = fs.createWriteStream('./access.log', {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));
// File Upload
app.use(fileUpload());
// Connection to DB and Server Activation
mongoConnection((client: any) => {
   server.listen(PORT, () => {
       console.log(`\nServer Activated\nListening on port ${PORT}\n`);
   });
});
// Middlewares
app.use(routes);