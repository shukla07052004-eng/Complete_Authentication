import connectDB from "@/lib/dbconnect"
import { User } from "@/models/userModel"


export async function POST(request: Request) {
    await connectDB();

    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username);

        const user = await User.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        const iscodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (iscodeValid && isCodeNotExpired) {
            console.log("BEFORE:", user.isVerified);

            user.isVerified = true;

            console.log("AFTER CHANGE:", user.isVerified);

            await user.save();

            console.log("AFTER SAVE:", user.isVerified);

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully",
                },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message:
                        'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message:
                        'varification is not valid',
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }

}