import mongoose from "mongoose"

const gradeSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
       student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
       },
        grade: {
            type: String,
            enum: ["O", "A", "B", "C", "D", "E", "P", "F", "AB"],
            required: true,
        },
        semester: {
            type: Number,
            min: 1,
            required: true
        },
        academicYear: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

gradeSchema.index({ course: 1, student: 1 , semester: 1, academicYear: 1}, { unique: true })

export const Grade = mongoose.model("Grade", gradeSchema)