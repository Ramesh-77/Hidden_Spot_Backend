import nodemailer from "nodemailer";
export const verifyEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, //true for 465, false for other port
      auth: {
        user: process.env.EMAIL_USER, //admin gmail id
        pass: process.env.EMAIL_PASS, //admin gmail pass
      },
    });
    // handle nodemailer
    //  use front end route

    // send email
    let emailLink = await transporter.sendMail({
      from: process.env.EMAIL_FROM, //from admin email
      to: email, //to user email
      subject: subject,
      html: html,
    });
    if (!emailLink) {
      throw new ApiError(
        500,
        `something went wrong while sending verification link to your ${email}`
      );
    }
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while sending gmail activation link to your gmail account "
    );
  }
};
