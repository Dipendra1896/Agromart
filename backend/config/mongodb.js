import mongoose from "mongoose";
// import dotenv from "dotenv";


const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Database connection established');
    });
    await mongoose.connect("mongodb+srv://koiralabishal:koiralabishal123@cluster0.iph69.mongodb.net/agromart");
};

export default connectDB;


