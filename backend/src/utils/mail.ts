import * as nodemailer from "nodemailer"

let mailTransporter = nodemailer.createTransport(
    {
        host: "in-v3.mailjet.com",
        port: 587,
        secure: false,
        auth: {
            user: "ak9004729@gmail.com",
            pass: "7b6c246e98a4340e1d82dd61d99952f2"
        }
    }
)

export async function sendOtp(body: string, email: string) {

    let details = {
        from: 'darkak900@gmail.com',
        to: email,
        subject: "Test mail",
        body,
    }


    try {
        await mailTransporter.sendMail(details)
    } catch (err) {
        console.log(err)
    }
}