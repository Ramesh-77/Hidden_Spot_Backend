import nodemailer from "nodemailer"
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, //true for 465, false for other port
    auth: {
      
      user: process.env.EMAIL_USER, //admin gmail id
      pass: process.env.EMAIL_PASS, //admin gmail pass
    },
  });