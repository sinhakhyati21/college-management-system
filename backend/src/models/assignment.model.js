import mongoose from "mongoose"

const assignmentSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        assignmentNumber: {
            type: Number,
            required: true
        },
        title: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String 
        },
        dueDate: {
            type: Date,
            required: true
        },
        totalMarks: {
            type: Number,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professor",
            required: true
        }
    },
    { timestamps: true }
)

assignmentSchema.index({ course: 1, assignmentNumber: 1 }, { unique: true })

export const Assignment = mongoose.model("Assignment", assignmentSchema)