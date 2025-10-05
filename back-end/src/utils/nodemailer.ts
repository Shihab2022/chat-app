import nodemailer from "nodemailer";
import config from "../app/config";

let transporter;

try {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: config?.smtp?.user_name,
            pass: config?.smtp?.password,
        },
    });
} catch (err) {
    console.error("Error creating Nodemailer transporter:", err);
}

export default transporter;
