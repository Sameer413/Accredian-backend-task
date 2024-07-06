import { PrismaClient } from "@prisma/client";
import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const prisma = new PrismaClient();

export function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhoneNumber(phoneNumber: string) {
  const regex =
    /^\+?(\d{1,3})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
  return regex.test(phoneNumber);
}

interface OptionDataType {
  email: string;
  subject: string;
  text: string;
}
export const sendEmail = async ({ email, subject, text }: OptionDataType) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      // secure: false,
      // auth: {
      //   // user: process.env.SMTP_Auth_Email,
      //   // pass: process.env.SMTP_Auth_Password,
      // },
      service: "gmail",
      secure: false,
      auth: {
        user: "smilesdelivery.in@gmail.com",
        pass: "kqwb bdcr zbii ydut",
      },
    });

    const mailOptions = {
      from: "sameertesting@outlook.com",
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error("Email sending failed");
  }
};
