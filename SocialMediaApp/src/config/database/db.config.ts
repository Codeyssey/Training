// Handles the database connection
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
if (!process.env.URI) {
    console.log("ERROR: Failed To Find URI");
    process.exit(1);
}
// Connecting to DB
const URI: string = process.env.URI as string;
export default ( callback: (client: any) => void ) => {
    mongoose.connect(URI)
    .then((client:any) => {
        console.log( "\nConnected to the Database Successfully" );
        callback(client);
    })
    .catch(err => console.log( `\nConnection to Database Failed\nERROR: ${err}` ))
}
