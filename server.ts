import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ReferralBody } from "./types";
import { prisma, sendEmail, validateEmail, validatePhoneNumber } from "./utils";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());

// const allowedOrigins = [
//   "http://localhost:3000",
//   process.env.FRONTEND_URL || "",
// ];

// const corsOptions = {
//   origin: function (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void
//   ) {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

const corsOptions = {
  origin:[
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:3000/"
  ]
}

app.use(cors(corsOptions));

app.route("/").get((req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Server is Working",
  });
});

app.route("/create-referral").post(async (req: Request, res: Response) => {
  const {
    referrerName,
    referrerEmail,
    referrerPhone,
    referrerRelationship,
    refereeName,
    refereeEmail,
    refereePhone,
    courseInterest,
    message,
  }: ReferralBody = req.body;

  if (
    !referrerName ||
    !referrerEmail ||
    !referrerPhone ||
    !referrerRelationship ||
    !refereeName ||
    !refereeEmail ||
    !refereePhone ||
    !courseInterest ||
    !message
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter all fields!",
    });
  }

  try {
    if (!validateEmail(refereeEmail) || !validateEmail(referrerEmail)) {
      return res.status(400).json({
        success: true,
        message: "Enter a valid email!",
      });
    }

    if (
      !validatePhoneNumber(refereePhone) ||
      !validatePhoneNumber(referrerPhone)
    ) {
      return res.status(400).json({
        success: true,
        message: "Enter a valid number!",
      });
    }

    const referral = await prisma.referrals.create({
      data: {
        referrer_name: referrerName,
        referrer_email: referrerEmail,
        referrer_phone: referrerPhone,
        referrer_relationship: referrerRelationship,
        referee_name: refereeName,
        referee_email: refereeEmail,
        referee_phone: refereePhone,
        course_interest: courseInterest,
        message: message,
      },
    });

    await sendEmail({
      email: refereeEmail,
      subject: "You Have Been Referred!",
      text: `Hi ${refereeName},\n\n${referrerName} has referred you for the ${courseInterest} course.\n\nMessage: ${message}\n\nBest regards,\nAccredian`,
    });

    return res.status(201).json({
      success: true,
      message: "Referral submitted successfully!",
      referral,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Starting the server
app.listen(process.env.PORT, () => {
  console.log("Server is working!");
});
