
















































// import { connect } from "@/lib/dbconnect";
// import { User } from "@/models/userModel"
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
// try {
//         // get user details from frontend
//         // validation - not empty
//         // check if user already exists: username, email
//         // check for images, check for avatar
//         // upload them to cloudinary, avatar
//         // create user object - create entry in db
//         // remove password and refresh token field from response
//         // check for user creation
//         // return res
//         connect()
    
    
//         const { email, username, password } = await request.json()
//         //console.log("email: ", email);
    
//         if (
//             [ email, username, password].some((field) => field?.trim() === "")
//         ) {
//             return NextResponse.json(
//                 { message: "Required fields cant be empty" },
//                 { status: 404 }
//             );
//         }
    
//         const existedUser = await User.findOne({
//             $or: [{ username }, { email }]
//         })
    
//         if (existedUser) {
//             return NextResponse.json(
//                 { message: "User with email or username already exists" },
//                 { status: 409 }
//             );
//         }
    
    
//         const user = await User.create({
//             email: email.trim().toLowerCase(),
//             password,
//             username: username.toLowerCase()
//         })
    
    
//         if (!user) {
//             return NextResponse.json(
//                 { message: "Something went wrong while registering the user" },
//                 { status: 500 }
//             );
//         }
//         return NextResponse.json({
//             status:200,
//             user,
//             message: "User created successfully",
//             success: true,
//         })
// } catch (error) {
//     console.log(error,"something went wrong")
//         return NextResponse.json(
//         {
//             success: false,
//             message: "Something went wrong"
//         },
//         { status: 500 }
//     );
// }

// } 