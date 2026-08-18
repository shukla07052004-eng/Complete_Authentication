import connectDB from "@/lib/dbconnect";
import { NextRequest, NextResponse } from "next/server"
import { User } from "@/models/userModel"
import { Loginverify } from "@/schemas/loginverify";
import bcrpt from "bcrypt"
import { sendEmail } from "@/helper/sendVerificationEmail";
import { apiResponse } from "@/types/apiResShortcut";

export async function POST(req: NextRequest) {
    connectDB()
    try {
        const body = await req.json()

        const result = Loginverify.safeParse(body)

        if (!result.success) {
            return apiResponse(
                {
                    success: false,
                    message: "please enter a valid username or email"
                }
            )
        }

        const { identifier, password } = result.data;

        const user = await User.findOne({
            Or: [
                { email: identifier },
                { username: identifier }
            ]
        })

        if (!user) {
            return apiResponse(
                {
                    success: false,
                    message: "User not exist please register first"
                }
            )
        }

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.verifyCode = verifyCode
        user.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await user.save();

        await sendEmail({ email: identifier, username: identifier, verifyCode })

        const iscodeValid = user.verifyCode.toString() === verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (iscodeValid && isCodeNotExpired) {
            const hashedPassword = await bcrpt.hash(password, 10);

            user.password = hashedPassword;

            await user.save();

            return apiResponse(
                {
                    success: true,
                    message: "Password saved successfully"
                }
            )

        } else if (!isCodeNotExpired) {
            return apiResponse(
                {
                    success: false,
                    message:
                        'Verification code has expired. Please sign up again to get a new code.',
                },
            );
        } else {
            return apiResponse(
                {
                    success: false,
                    message:
                        'varification is not valid',
                },
            );
        }
    } catch (error) {
        console.log(
            "Something went wrong, server down"
        )
        return apiResponse(
            {
                success: false,
                message: "Something went wrong, server down"
            }
        )

    }

}