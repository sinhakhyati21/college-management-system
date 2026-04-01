import mongoose from "mongoose"
import { DEPARTMENTS } from "../constants.js";
const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        code: {
            type: String,
            match: /^[A-Z0-9]{6}$/,
            required: true,
            unique: true
        },
        isActive: {
             type: Boolean, 
             default: true 
        },
        department: {
            type: String,
            enum: DEPARTMENTS,
            required: true
        },
        courseCategory: {
            type: String,
            enum: ["Theory", "Lab", "Audit", "Other"],
            required: true,
        },
        credits: {
            type: Number,
            min: 0,
            max: 4,
        },
        semester: {
            type: Number,
            required: true,
        },
        degree: {
            type: String,
            enum: ["UG", "PG", "Ph.D"],
            required: true,
        },
        branch: {
            type: String,
            enum: DEPARTMENTS,
            required: true
        },
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professor",
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student"
            }
        ],
        academicYear: { 
            type: String, 
            required: true 
        },
        
    },
    { timestamps: true }
)

export const Course = mongoose.model("Course", courseSchema);