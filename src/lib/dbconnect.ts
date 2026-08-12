import mongoose from "mongoose";

type ConnectObject = {
    isConnected?: number;
}

const connection: ConnectObject = {}

async function connectDB(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI! || '', {})
        
        connection.isConnected = db.connections[0].readyState;

        console.log('Database connected successfully');
    } catch (error) {
        console.log("Failed to connect DB", error)
    }
}

export default connectDB