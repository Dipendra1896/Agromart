import nodemailer from 'nodemailer';


const  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user:'koiralabishal3@gmail.com' ,
        pass: 'aoivbznhfrgihaky'
    }
});

export default transporter;