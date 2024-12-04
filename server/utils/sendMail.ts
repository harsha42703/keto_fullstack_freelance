import type { text } from "body-parser";
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  console.log(options, process.env.MAIL, process.env.PASSWORD);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    // secure: false, // Set to true if using TLS
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });
  console.log(transporter, "this is transporter");

  const mailOptions = {
    from: "lokeshkatari921@gmail.com", //from email to be sent to the alumnu
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
}
