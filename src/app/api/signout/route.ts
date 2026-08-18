import connectDB from "@/lib/dbconnect";
import { apiResponse } from "@/types/apiResShortcut";
import { NextRequest } from "next/server";
import { User } from "@/models/userModel";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken },
                {
                    $unset: {
                        refreshToken: 1
                    }
                }
            );
        }

        const response = apiResponse({
            success: true,
            message: "Logged out successfully"
        });

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    } catch (error) {
        console.log("Error in loggin-out, Server issue", error)
        return apiResponse(
            {
                success: false,
                message: "error in loggin-out"
            }

        )
    }
}