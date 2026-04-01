import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true
        },
       student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
       },
       fileUrl: {
            type: String,
            required: true
        },
        marksObtained: {
            type: Number,
        },
        gradedAt: {
            type: Date
        }
    },
    { timestamps: true }
)
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })

export const Submission = mongoose.model("Submission", submissionSchema)