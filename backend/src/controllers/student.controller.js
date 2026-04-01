import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Assignment } from "../models/assignment.model.js"
import { Student } from "../models/studentProfile.model.js"
import { Submission } from "../models/submission.model.js"
import { Attendance } from "../models/attendance.model.js"
import { Grade } from "../models/grade.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const submitAssignment = asyncHandler(async (req, res) => {
    const { assignment } = req.body

    if (!assignment) {
        throw new ApiError(400, "Select the assignment")
    }

    const student = req.user.profile

    const fileLocalPath = req.files?.assignment?.[0]?.path
    if (!fileLocalPath) throw new ApiError(400, "Assignment file is required")

    const Assign = await Assignment.findById(assignment)
    if (!Assign) throw new ApiError(404, "Assignment does not exist")

    const StudentSubmitting = await Student.findById(student)
    if (!StudentSubmitting) throw new ApiError(404, "Student not found")

    if (Assign.dueDate < new Date()) {
        throw new ApiError(400, "Assignment due date has passed")
    }

    const existing = await Submission.findOne({ assignment, student })
    if (existing) throw new ApiError(400, "Assignment already submitted")

    const file = await uploadOnCloudinary(fileLocalPath)
    if (!file?.url) throw new ApiError(500, "Failed to upload file")

    const submittedAssignment = await Submission.create({
        student,
        assignment,
        fileUrl: file.url
    })

    return res.status(201).json(
        new ApiResponse(201, submittedAssignment, "Assignment submitted successfully")
    )
})

const getMyAttendance = asyncHandler(async (req, res) => {
    const student = req.user.profile
    const { courseId } = req.query

    const filter = { student }
    if (courseId) filter.course = courseId

    const attendance = await Attendance.find(filter).populate("course", "title code")

    return res.status(200).json(
        new ApiResponse(200, attendance, "Attendance fetched successfully")
    )
})

const getMyGrades = asyncHandler(async (req, res) => {
    const student = req.user.profile
    const { courseId } = req.query

    const filter = { student }
    if (courseId) filter.course = courseId

    const grades = await Grade.find(filter).populate("course", "title code")

    return res.status(200).json(
        new ApiResponse(200, grades, "Grades fetched successfully")
    )
})

const getMyProgress = asyncHandler(async (req, res) => {
    const student = req.user.profile

    const attendance = await Attendance.find({ student }).populate("course", "title code")
    const grades = await Grade.find({ student }).populate("course", "title code")
    const submissions = await Submission.find({ student }).populate("assignment", "title dueDate totalMarks")

    return res.status(200).json(
        new ApiResponse(200, { attendance, grades, submissions }, "Progress fetched successfully")
    )
})

export {
    submitAssignment,
    getMyAttendance,
    getMyGrades,
    getMyProgress
}