import mongoose from "mongoose"
import { Attendance } from "../models/attendance.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Course } from "../models/course.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Professor } from "../models/professorProfile.model.js"
import { Assignment } from "../models/assignment.model.js"
import { Grade } from "../models/grade.model.js"

const uploadAttendance = asyncHandler(async (req, res) => {
    const { courseId, date, attendance } = req.body

    if (!courseId || !date || !attendance || !attendance.length) {
        throw new ApiError(400, "courseId, date and attendance array are required")
    }

    const course = await Course.findById(courseId)
    if (!course) throw new ApiError(404, "Course not found")

    const records = attendance.map(entry => ({
        student: entry.studentId,
        course: courseId,
        date,
        status: entry.status
    }))

    await Attendance.insertMany(records, { ordered: false })

    return res.status(200).json(
        new ApiResponse(200, null, "Attendance uploaded successfully")
    )
})

const createAssignment = asyncHandler(async (req, res) => {
    const { course, assignmentNumber, title, description, dueDate, totalMarks } = req.body

    if (!course || !assignmentNumber || !title || !dueDate || !totalMarks) {
        throw new ApiError(400, "Fill all the mandatory fields")
    }

    const createdBy = req.user.profile

    const courseAssign = await Course.findById(course)
    if (!courseAssign) throw new ApiError(404, "Course not found")

    const professor = await Professor.findById(createdBy)
    if (!professor) throw new ApiError(404, "Professor not found")

    const existingAssignment = await Assignment.findOne({ course, assignmentNumber })
    if (existingAssignment) {
        throw new ApiError(400, "Assignment already exists")
    }

    const assignment = await Assignment.create({
        course, assignmentNumber, title, description, dueDate, totalMarks, createdBy
    })

    return res.status(201).json(
        new ApiResponse(201, assignment, "Assignment created successfully")
    )
})

const uploadGrades = asyncHandler(async (req, res) => {
    const { course, grades, semester, academicYear } = req.body

    if (!course || !grades || !grades.length || !semester || !academicYear) {
        throw new ApiError(400, "All fields are mandatory")
    }

    const existingCourse = await Course.findById(course)
    if (!existingCourse) throw new ApiError(404, "Course not found")

    const records = grades.map(entry => ({
        student: entry.studentId,
        course,
        grade: entry.grade,
        semester,
        academicYear
    }))

    await Grade.insertMany(records, { ordered: false })

    return res.status(200).json(
        new ApiResponse(200, null, "Grades uploaded successfully")
    )
})

const getStudentAnalytics = asyncHandler(async (req, res) => {
    const { courseId } = req.params

    const course = await Course.findById(courseId)
    if (!course) throw new ApiError(404, "Course not found")

    const courseObjectId = new mongoose.Types.ObjectId(courseId)

    const attendanceData = await Attendance.aggregate([
        { $match: { course: courseObjectId } },
        { $group: {
            _id: "$student",
            total: { $sum: 1 },
            present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } }
        }},
        { $addFields: {
            percentage: { $multiply: [{ $divide: ["$present", "$total"] }, 100] }
        }}
    ])

    const grades = await Grade.find({ course: courseId })

    return res.status(200).json(
        new ApiResponse(200, { attendance: attendanceData, grades }, "Analytics fetched successfully")
    )
})

export {
    uploadAttendance,
    createAssignment,
    uploadGrades,
    getStudentAnalytics
}