
import { Resend } from 'resend';
import {User} from "@/models/userModel"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({email, emailType, userId, Token, TokenExpiry}: any) {
    try {
        console.log("signup route hit")

        
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
                {verifyToken: Token, verifyTokenExpiry: TokenExpiry})
        } else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken: Token, forgotPasswordTokenExpiry: TokenExpiry})
        }


        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Resend Test ",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${Token}">here</a> to
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${Token}
            </p>`

        });
        console.log(data);
        console.log(error);

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        console.error("Signup Error:", error);
        return Response.json({ error: String(error) }, { status: 500 });
    }
}