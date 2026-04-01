import mongoose from "mongoose"

const acadCalendarSchema = new mongoose.Schema(
    {   
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String
        },
        academicYear: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
        visibleTo: {
            type: String,
            enum: ["All", "Student", "Professor", "Admin"],
            required: true
        }
    },
    { timestamps: true }
)

export const AcadCalendar = mongoose.model("AcadCalendar", acadCalendarSchema)