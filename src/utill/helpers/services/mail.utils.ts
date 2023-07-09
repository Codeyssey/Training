import nodemailer, { Transporter } from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const emailSender = async (rcvrEmail: string): Promise<boolean> => {
    try {
        if (!process.env.EMAIL || !process.env.EMAIL_PW) {
            console.log("Credentials Not Set FOR NODEMAILER");
            throw(Error("Credentials Not Set FOR NODEMAILER"))
        }
        const email: string = process.env.EMAIL;
        const password: string = process.env.EMAIL_PW;
        const transporter: Transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            // secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
            ciphers:'SSLv3'
            },
            requireTLS:true,//this parameter solved problem for me

            auth: {
                user: email,
                pass: password
            }
        })
        const emailBody: string = `You have been invited as a collaborator to a task sign up on this url http://localhost:3000/register` ;
        const options = {
            from: email,
            to: rcvrEmail,
            subject: `Task Collaborator Invitation`,
            text: emailBody,
        };
        const { error } = await transporter.sendMail(options);
        if (error) throw error;
        console.log(`Signup email has been successfully sent to ${rcvrEmail}`);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
export default emailSender;