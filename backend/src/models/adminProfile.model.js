import mongoose from "mongoose"

const adminSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        isActive: { 
            type: Boolean, 
            default: true 
        },
        designation: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            match: /^[0-9]{10}$/,
        },
        address: {
            street:  { type: String },
            city:    { type: String },
            state:   { type: String },
            pincode: { type: String, match: /^[0-9]{6}$/ }
        },   
    },
    { timestamps: true }
)

export const Admin = mongoose.model("Admin", adminSchema);