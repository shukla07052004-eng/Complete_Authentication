import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    Token: string;
    TokenExpiry: Date;
    forgotPasswordToken: string;
    forgotPasswordTokenExpiry: Date;
    verifyToken: string;
    verifyTokenExpiry: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema<User> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        Token: String,
        TokenExpiry: Date,
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date
    },
    {
        timestamps: true
    }
);


export const User =
    mongoose.models.User || mongoose.model<User>("User", UserSchema);
