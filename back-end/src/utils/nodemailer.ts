import nodemailer from "nodemailer";

let transporter;

try {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
} catch (err) {
    console.error("Error creating Nodemailer transporter:", err);
}

export default transporter;
