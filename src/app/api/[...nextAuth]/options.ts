import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials";
import { User } from "@/models/userModel";
import connectDB from '@/lib/dbconnect';
import { Loginverify } from '@/schemas/loginverify';
import bcrypt from "bcrypt"

export const authOptions: any = {
    providers: [
        Credentials({
            // "I want to allow users to authenticate using credentials that I provide."
            // These lines Only tells AUTH.js that "My application has a credentials-based login provider."
            credentials: {
                identifier: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                // This function is called when a user attempts to log in using the credentials provider.
                // You can implement your own logic here to verify the user's credentials.
                // For example, you can check the provided email and password against your database.
                connectDB();
                try {
                    const { identifier, password } = await Loginverify.parseAsync(Credentials)

                    const user = await User.findOne({
                        email: identifier,
                        username: identifier
                    })
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }
                    const ispasswordCorrect = await bcrypt.compare(
                        password,
                        user.password
                    )

                    if (ispasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect password');
                    }



                } catch (err: any) {
                    throw new Error(err);
                }


            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token
        },
        async session({ session, token}: any) {
            if (token) {
                session._id = token._id;
                session.isVerified = token.isVerified;
                session.isAcceptingMessages = token.isAcceptingMessages;
                session.username = token.username;
            }

            return session
        }
    },
    session:{
        strategy:"jwt" 
    },
    pages:{
        signIn: "/sign-in",
    }
};
