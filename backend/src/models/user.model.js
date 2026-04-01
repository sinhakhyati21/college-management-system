import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["Student", "Professor", "Admin"],
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isPasswordSet: {
            type: Boolean,
            default: false
        },
        refreshToken: { 
            type: String,
            select: false
        },
        passwordResetToken: {
            type: String,
            select: false,
            index: true
        },
        passwordResetExpiry: {
            type: Date
        },
        twoFactorSecret: {
            type: String,
            select: false
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        otpToken: {
            type: String,
            select: false,
        },
        otpExpiry: {
            type: Date,
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "role"
        },
        loginLogs: [
            {
                _id: false,
                timestamp: {
                    type: Date,
                    default: Date.now
                },
                ip: {
                    type: String
                },
                device: {
                    type: String
                }
            }
        ]
    },
    { timestamps: true }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)