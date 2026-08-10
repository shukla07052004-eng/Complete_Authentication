import connectDB from "@/lib/dbconnect";
import { NextRequest } from "next/server"
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "@/models/userModel"
import { signupVerifySchema } from '@/schemas/signupverify'
import bcrpt from "bcrypt"
import { sendEmail } from "@/helper/sendVerificationEmail";

export async function POST(req: NextRequest) {
    try {
        connectDB()


        const body = await req.json()

        const result = signupVerifySchema.safeParse(body)

        if (!result.success) {
            return {
                success: false,
                message: "please enter a valid Email"
            }
            {
                status: 401
            }
        }

        const { email, username, password } = result.data

        const existingUserByEmail = await User.findOne({ email })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


        if (existingUserByEmail) {
            if (existingUserByEmail.isvarified) {
                return {
                    success: false,
                    message: "User Verification Completed Successfully: User Verified"
                }
                {
                    status: 201
                }
            } else {
                const hashedPassword = await bcrpt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();

                await sendEmail({ email, username, verifyCode })

            }
        } else {
            const hashedPassword = await bcrpt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new User(
                {
                    username,
                    email,
                    password: hashedPassword,
                    isVarified: false,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                }
            )

            await newUser.save()

            // send verification code

            const emailResponse = await sendEmail({ email, username, verifyCode })

            if (!emailResponse.success) {
                return Response.json(
                    {
                        success: false,
                        message: emailResponse.message,
                    },
                    { status: 500 }
                );
            }

            return Response.json(
                {
                    success: true,
                    message: 'User registered successfully. Please verify your account.',
                },
                { status: 201 }
            );

        }

    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}































// export const runtime = "nodejs";

// import { connect } from "@/lib/dbconnect";
// import { User } from "@/models/userModel"
// import { NextRequest, NextResponse } from "next/server";
// import crypto, { verify } from "crypto";
// import { sendEmail } from "@/helper/resend"
// import { Resend } from 'resend';


// const resend = new Resend(process.env.RESEND_API_KEY);
// export async function POST(request: NextRequest) {
//     try {
//         await connect()
//         const { email, username } = await request.json()

//         console.log("EMAIL RECEIVED:", JSON.stringify(email));
//         console.log("EMAIL Username:", JSON.stringify(username));

//         if (!(email || username)) {
//             return NextResponse.json(
//                 { message: "email or username not found not found" },
//                 { status: 404 }
//             );
//         }


//         const normalizedEmail = email.trim().toLowerCase();
//         const normalizedUsername= username.trim().toLowerCase();

//         const user = await User.findOne({
//             $or: [
//                 { username: normalizedUsername },
//                 { email: normalizedEmail }
//             ]
//         })

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "User not found"
//                 },
//                 { status: 404 }
//             );
//         }

//         // generating a token and hashing it
//         const resetToken = crypto.randomBytes(32).toString("hex");
//         const hashedToken = crypto
//             .createHash("sha256")
//             .update(resetToken)
//             .digest("hex");

//         user.Token = hashedToken
//         user.TokenExpiry = new Date(Date.now() + 360000)


//         const savedUser = await user.save()

//         await sendEmail({ email, emailType: "verify", userId: savedUser._id, Token: savedUser.Token, TokenExpiry: savedUser.TokenExpiry })

//         return NextResponse.json({
//             message: "Email verified sucessfull now hear on role of frontend and database start",
//             success: true,
//             savedUser
//         })


//     } catch (error) {
//         console.log(error, "failed to complete forget password task")
//         return Response.json({ error: String(error) }, { status: 500 });
//     }
// }