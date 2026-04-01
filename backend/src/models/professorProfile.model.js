import mongoose from "mongoose"
import { DEPARTMENTS } from "../constants.js"

const professorSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            unique: true,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        department: {
            type: String,
            enum: DEPARTMENTS,
            required: true,
        }, 
        designation: {
            type: String,
            enum: ["Assistant Professor", "Professor", "Associate Professor"],
            required: true
        },

        researchArea: [
            {type: String}
    ],
        joiningYear: {
            type: Number,
            required: true,
        },
        dob: {
            type: Date,
            required: true
        },
        address: {
            street:  { type: String },
            city:    { type: String },
            state:   { type: String },
            pincode: { type: String, match: /^[0-9]{6}$/ }
        },
        phone: { 
            type: String, 
            match: /^[0-9]{10}$/ 
        },
        photo: {
            type: String
        },

    },
    {timestamps: true}
)

export const Professor = mongoose.model("Professor", professorSchema)