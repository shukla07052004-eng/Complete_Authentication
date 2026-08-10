import connectDB from "@/lib/dbconnect";


export async function post() {
    try {
       connectDB
       
    } catch (error) {

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