import { asyncHandler } from "../utils/asyncHandler.js"
import { Course } from "../models/course.model.js"
import { Professor } from "../models/professorProfile.model.js"
import { Student } from "../models/studentProfile.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { DEPARTMENTS } from "../constants.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const addCourse = asyncHandler(async (req, res) => {
    const {
        title, code, department, courseCategory, semester, degree, branch, academicYear, credits, professor
    } = req.body
    if (!title || !code || !department || !courseCategory ||
        !semester || !degree || !branch || !academicYear) {
        throw new ApiError(400, "Fill all the mandatory fields")
    }
    if (!["UG", "PG", "Ph.D"].includes(degree)) {
        throw new ApiError(400, "Invalid degree")
    }
    if (!DEPARTMENTS.includes(branch)) {
        throw new ApiError(400, "Invalid branch")
    }
    if (!["Theory", "Lab", "Audit", "Other"].includes(courseCategory)) {
        throw new ApiError(400, "Invalid course category")
    }
    const existingCourse = await Course.findOne({ code, academicYear })
    if (existingCourse) {
        throw new ApiError(400, "Course already exists")
    }
    const course = await Course.create({
        title, code, department, courseCategory, semester, degree, branch, academicYear, credits, professor
    })
    return res.status(201).json(
        new ApiResponse(201, course, "Course created successfully")
    )
})

const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params
    const course = await Course.findById(courseId)
    if (!course) {
        throw new ApiError(404, "Course not found")
    }
    if (!course.isActive) {
        throw new ApiError(400, "Course is already deleted")
    }
    course.isActive = false
    await course.save()
    return res.status(200).json(
        new ApiResponse(200, null, "Course deleted successfully")
    )
})

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ isActive: true })
    return res.status(200).json(
        new ApiResponse(200, courses, "Courses fetched successfully")
    )
})

const getAllProfessors = asyncHandler(async (req, res) => {
    const professors = await Professor.find()
    return res.status(200).json(
        new ApiResponse(200, professors, "Professors fetched successfully")
    )
})

const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find()
    return res.status(200).json(
        new ApiResponse(200, students, "Students fetched successfully")
    )
})

const deleteProfessor = asyncHandler(async (req, res) => {
    const { professorId } = req.params
    const professor = await Professor.findById(professorId)
    if (!professor) throw new ApiError(404, "Professor not found")
    const user = await User.findById(professor.user)
    if (!user) throw new ApiError(404, "User not found")
    await Professor.findByIdAndDelete(professorId)
    user.isActive = false
    await user.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(200, null, "Professor deleted successfully")
    )
})

const deleteStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.params
    const student = await Student.findById(studentId)
    if (!student) throw new ApiError(404, "Student not found")
    const user = await User.findById(student.user)
    if (!user) throw new ApiError(404, "User not found")
    await Student.findByIdAndDelete(studentId)
    user.isActive = false
    await user.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(200, null, "Student deleted successfully")
    )
})

export {
    addCourse,
    deleteCourse,
    getAllCourses,
    getAllProfessors,
    getAllStudents,
    deleteProfessor,
    deleteStudent
}