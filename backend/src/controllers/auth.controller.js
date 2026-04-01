import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Professor } from "../models/professorProfile.model.js"
import { Student } from "../models/studentProfile.model.js"
import { Admin } from "../models/adminProfile.model.js"
import mongoose from "mongoose"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { sendPasswordSetEmail, sendPasswordResetEmail, sendOtpEmail } from "../utils/sendEmail.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { generateTokens } from "../utils/generateTokens.js"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
}

const addFirstAdmin = asyncHandler(async (req, res) => {
    const existingAdmin = await User.findOne({ role: "Admin" })
    if (existingAdmin) {
        throw new ApiError(403, "System already initialized")
    }

    const { name, email, designation } = req.body

    if (!name || !email || !designation) {
        throw new ApiError(400, "Name, email and designation are required")
    }

    const photoLocalPath = req.files?.photo?.[0]?.path
    if (!photoLocalPath) throw new ApiError(400, "Photo is required")

    const photo = await uploadOnCloudinary(photoLocalPath)
    if (!photo?.url) throw new ApiError(500, "Failed to upload photo")

    const resetToken = crypto.randomBytes(64).toString("hex")
    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const session = await mongoose.startSession()
    session.startTransaction()

    let createdUser
    try {
        const user = await User.create([{
            name,
            role: "Admin",
            email,
            password: hashToken,
            passwordResetToken: hashToken,
            passwordResetExpiry: tokenExpiry,
            isPasswordSet: false
        }], { session })

        const profile = await Admin.create([{
            user: user[0]._id,
            designation,
            photo: photo.url
        }], { session })

        user[0].profile = profile[0]._id
        await user[0].save({ session })

        await session.commitTransaction()

        createdUser = await User.findById(user[0]._id).select("-password -passwordResetToken")

    } catch (error) {
    await session.abortTransaction()
    console.log("FULL ERROR:", error)
    throw new ApiError(500, "Failed to create admin: " + error.message)
    } finally {
        session.endSession()
    }

    try {
        await sendPasswordSetEmail(email, name, resetToken)
    } catch (emailError) {
        console.error("Failed to send email:", emailError.message)
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "Admin created successfully. Check email to set password.")
    )
})

const registerUser = asyncHandler(async (req, res) => {
    const {
        name, email, role,
        employeeId, department, designation, joiningYear,
        rollno, degree, branch, admissionYear, semester,
        dob
    } = req.body

    if (!name || !email || !role) {
        throw new ApiError(400, "Name, email and role are required")
    }

    if (!["Student", "Professor", "Admin"].includes(role)) {
        throw new ApiError(400, "Invalid role")
    }

    const existingEmail = await User.findOne({ email })
    if (existingEmail) throw new ApiError(400, "Email already registered")

    if (role === "Professor") {
        if (!employeeId || !department || !designation || !joiningYear || !dob) {
            throw new ApiError(400, "employeeId, department, designation, joiningYear and dob are required for Professor")
        }
        const existingEmployeeId = await Professor.findOne({ employeeId })
        if (existingEmployeeId) throw new ApiError(400, "Employee ID already registered")
    }

    if (role === "Student") {
        if (!rollno || !degree || !branch || !admissionYear || !dob) {
            throw new ApiError(400, "rollno, degree, branch, admissionYear and dob are required for Student")
        }
        const existingRollno = await Student.findOne({ rollno })
        if (existingRollno) throw new ApiError(400, "Roll number already registered")
    }

    const photoLocalPath = req.files?.photo?.[0]?.path
    if (!photoLocalPath) throw new ApiError(400, "Photo is required")

    let signatureLocalPath
    if (role === "Student") {
        signatureLocalPath = req.files?.signature?.[0]?.path
        if (!signatureLocalPath) throw new ApiError(400, "Signature is required for students")
    }

    const photo = await uploadOnCloudinary(photoLocalPath)
    if (!photo?.url) throw new ApiError(500, "Failed to upload photo")

    let signature
    if (role === "Student") {
        signature = await uploadOnCloudinary(signatureLocalPath)
        if (!signature?.url) throw new ApiError(500, "Failed to upload signature")
    }

    const resetToken = crypto.randomBytes(64).toString("hex")
    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const session = await mongoose.startSession()
    session.startTransaction()

    let createdUser
    try {
        const user = await User.create([{
            name, role, email,
            password: hashToken,
            passwordResetToken: hashToken,
            passwordResetExpiry: tokenExpiry,
            isPasswordSet: false
        }], { session })

        let profile

        if (role === "Professor") {
            profile = await Professor.create([{
                user: user[0]._id,
                employeeId, department, designation, joiningYear, dob,
                photo: photo.url
            }], { session })
        } else if (role === "Student") {
            profile = await Student.create([{
                user: user[0]._id,
                rollno, degree, branch, admissionYear, semester,
                enrolledCourses: [],
                dob,
                photo: photo.url,
                signature: signature.url
            }], { session })
        } else if (role === "Admin") {
            profile = await Admin.create([{
                user: user[0]._id,
                designation,
                photo: photo.url
            }], { session })
        }

        user[0].profile = profile[0]._id
        await user[0].save({ session })

        await session.commitTransaction()

        createdUser = await User.findById(user[0]._id).select("-password -passwordResetToken")

    } catch (error) {
        await session.abortTransaction()
        throw new ApiError(500, "Registration failed: " + error.message)
    } finally {
        session.endSession()
    }

    try {
        await sendPasswordSetEmail(email, name, resetToken)
    } catch (emailError) {
        console.error("Failed to send password set email:", emailError.message)
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully. Check email to set password.")
    )
})

const setPassword = asyncHandler(async (req, res) => {
    const { token, password, confirmPassword } = req.body

    if (!token || !password || !confirmPassword) {
        throw new ApiError(400, "Token, password and confirm password are required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match")
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters")
    }

    const hashToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError(400, "Invalid or expired token. Please contact admin to resend the link")
    }

    if (user.isPasswordSet) {
        throw new ApiError(400, "Password already set. Please use forgot password if you need to reset it")
    }

    user.password = password
    user.isPasswordSet = true
    user.passwordResetToken = undefined
    user.passwordResetExpiry = undefined

    await user.save()

    return res.status(200).json(
        new ApiResponse(200, null, "Password set successfully. You can now log in")
    )
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    const user = await User.findOne({ email }).select("+password +refreshToken")

    if (!user) {
        throw new ApiError(401, "Invalid email or password")
    }

    if (!user.isPasswordSet) {
        throw new ApiError(401, "Please set your password first. Check your registration email")
    }

    const isMatch = await user.isPasswordCorrect(password)
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password")
    }

    if (user.twoFactorEnabled) {
        await setup2FA(user)
        return res.status(200).json(
            new ApiResponse(200, {
                twoFactorRequired: true,
                userId: user._id
            }, "2FA verification required")
        )
    }

    const { accessToken, refreshToken } = await generateTokens(user)

    user.loginLogs.push({
        timestamp: new Date(),
        ip: req.ip,
        device: req.headers["user-agent"] || "Unknown"
    })

    if (user.loginLogs.length > 10) {
        user.loginLogs = user.loginLogs.slice(-10)
    }

    await user.save({ validateBeforeSave: false })

    const loggedInUser = await User.findById(user._id).populate("profile")

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "Login successful"))
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    )

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "Logged out successfully"))
})

const refreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token missing")
    }

    let decoded
    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token. Please log in again")
    }

    const user = await User.findById(decoded.id).select("+refreshToken")

    if (!user) {
        throw new ApiError(401, "User no longer exists")
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is invalid. Please log in again")
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user)

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .json(new ApiResponse(200, { accessToken }, "Token refreshed successfully"))
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(200).json(
            new ApiResponse(200, null, "If this email is registered, a reset link has been sent")
        )
    }

    if (!user.isPasswordSet) {
        return res.status(200).json(
            new ApiResponse(200, null, "If this email is registered, a reset link has been sent")
        )
    }

    const resetToken = crypto.randomBytes(64).toString("hex")
    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const tokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000)

    user.passwordResetToken = hashToken
    user.passwordResetExpiry = tokenExpiry
    await user.save({ validateBeforeSave: false })

    try {
        await sendPasswordResetEmail(email, user.name, resetToken)
    } catch (emailError) {
        user.passwordResetToken = undefined
        user.passwordResetExpiry = undefined
        await user.save({ validateBeforeSave: false })
        throw new ApiError(500, "Failed to send reset email. Please try again")
    }

    return res.status(200).json(
        new ApiResponse(200, null, "If this email is registered, a reset link has been sent")
    )
})

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params
    const { password, confirmPassword } = req.body

    if (!token) {
        throw new ApiError(400, "Reset token is missing")
    }

    if (!password || !confirmPassword) {
        throw new ApiError(400, "Password and confirm password are required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match")
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters")
    }

    const hashToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token")
    }

    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpiry = undefined
    user.isPasswordSet = true
    user.refreshToken = undefined

    await user.save()

    return res.status(200).json(
        new ApiResponse(200, null, "Password reset successful. Please log in again")
    )
})

const setup2FA = async (user) => {
    const otp = Math.floor(Math.random() * 899999) + 100000
    const otpToken = crypto.createHash("sha256").update(otp.toString()).digest("hex")
    user.otpToken = otpToken
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    await user.save({ validateBeforeSave: false })
    try {
        await sendOtpEmail(user.email, user.name, otp)
    } catch (emailError) {
        user.otpToken = undefined
        user.otpExpiry = undefined
        await user.save({ validateBeforeSave: false })
        throw new ApiError(500, "Failed to send OTP email. Please try again")
    }
}

const verify2FA = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body

    if (!userId || !otp) {
        throw new ApiError(400, "userId and otp are required")
    }

    const user = await User.findById(userId).select("+otpToken +otpExpiry")

    if (!user) {
        throw new ApiError(401, "User does not exist")
    }

    if (!user.otpToken || !user.otpExpiry) {
        throw new ApiError(400, "OTP not generated. Please login again")
    }

    if (user.otpExpiry < Date.now()) {
        throw new ApiError(400, "OTP has expired. Please login again")
    }

    const incomingOtp = crypto.createHash("sha256").update(otp.toString()).digest("hex")

    if (user.otpToken !== incomingOtp) {
        throw new ApiError(400, "Invalid OTP")
    }

    user.otpToken = undefined
    user.otpExpiry = undefined

    user.loginLogs.push({
        timestamp: new Date(),
        ip: req.ip,
        device: req.headers["user-agent"] || "Unknown"
    })

    if (user.loginLogs.length > 10) {
        user.loginLogs = user.loginLogs.slice(-10)
    }

    await user.save({ validateBeforeSave: false })

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user)

    const loggedInUser = await User.findById(user._id).populate("profile")

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "Login successful"))
})

export {
    addFirstAdmin,
    registerUser,
    setPassword,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    setup2FA,
    verify2FA
}