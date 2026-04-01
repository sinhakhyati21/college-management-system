import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger: process.env.NODE_ENV === "development"
})

const sendPasswordSetEmail = async (email, name, token) => {
    const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Set your password",
            html: `<p>Hi ${name},</p>
                   <p>Click the link below to set your password.</p>
                   <a href="${link}">Set Password</a>`
        })
    } catch (err) {
        console.error("Email send error (SetPassword):", err.message)
        throw err
    }
}

const sendPasswordResetEmail = async (email, name, token) => {
    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset your password",
            html: `<p>Hi ${name},</p>
                   <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                   <a href="${link}">Reset Password</a>`
        })
    } catch (err) {
        console.error("Email send error (ResetPassword):", err.message)
        throw err
    }
}

const sendOtpEmail = async (email, name, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your login OTP",
            html: `<p>Hi ${name},</p>
                   <p>Your OTP for login is: <strong>${otp}</strong></p>
                   <p>This OTP is valid for 10 minutes.</p>`
        })
    } catch (err) {
        console.error("Email send error (OTP):", err.message)
        throw err
    }
}

export { sendPasswordSetEmail, sendPasswordResetEmail, sendOtpEmail }
