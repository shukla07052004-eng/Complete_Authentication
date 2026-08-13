import connectDB from "@/lib/dbconnect"
import { signupVerifySchema } from "@/schemas/signupverify"
import { success, z } from 'zod'
import { User } from "@/models/userModel"


const usernameQuerySchema = z.object({
    username: signupVerifySchema
})

export async function POST(request: Request) {
    connectDB()
    try {
        const { searchParams } = new URL(request.url);
        const querryParam = {
            username: searchParams.get("username")
        }

        const result = usernameQuerySchema.safeParse(querryParam)

        if (!result.success) {
            const usernameErrors = z.flattenError(result.error).fieldErrors.username || []
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                },
                {
                    status: 400
                }
            )
        }
        const { username } = result.data

        const isUserVerified = await User.findOne({
            username,
            isverified: true
        })

        if (isUserVerified) {
            return Response.json(
                {
                    success: false,
                    message: "User with this username already exist, Try with another one"
                },
                {status: 200}
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            },
            {status: 200}
        )


    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}