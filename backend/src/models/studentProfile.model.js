import { UG_BRANCHES, DEPARTMENTS } from "../constants.js"
import mongoose from "mongoose"
const studentSchema = new mongoose.Schema(
    {
       
        rollno: {
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
        degree: {
            type: String,
            enum: ["UG", "PG", "Ph.D"],
            required: true,
        },
        branch: {
            type: String,
            required: true,
            validate: {
                validator: function(value) {
                    if (this.degree === "UG") {
                        return UG_BRANCHES.includes(value)
                    }
                    return DEPARTMENTS.includes(value)
                },
                message: "Invalid branch for selected degree"
            }
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            }
        ],
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
        admissionYear: { 
            type: Number, 
            required: true 
        },
        semester: {
            type: Number,
            min: 1
        },
        photo: {
            type: String
        },
        signature: {
            type: String
        }

    },
    {timestamps: true}
)

export const Student = mongoose.model("Student", studentSchema)