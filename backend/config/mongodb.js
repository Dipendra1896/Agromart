import mongoose from "mongoose";



const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Database connection established');
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/agromart`);
};

export default connectDB;


