import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["Present", "Absent"],
            required: true
        }
    },
    { timestamps: true }
)

attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true })

export const Attendance = mongoose.model("Attendance", attendanceSchema)