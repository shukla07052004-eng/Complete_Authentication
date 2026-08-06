import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/`)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on("Error", (err)=>{     
            console.log(err.message + 'Failed to connect to db server')
            process.exit()
        })
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB