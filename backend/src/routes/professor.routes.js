// professor.routes.js
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/rbac.middleware.js"
import { uploadAttendance, createAssignment, uploadGrades, getStudentAnalytics } from "../controllers/professor.controller.js"

const router = Router()

router.route("/attendance").post(verifyJWT, authorizeRoles("Professor"), uploadAttendance)
router.route("/assignments").post(verifyJWT, authorizeRoles("Professor"), createAssignment)
router.route("/grades").post(verifyJWT, authorizeRoles("Professor"), uploadGrades)
router.route("/analytics/:courseId").get(verifyJWT, authorizeRoles("Professor"), getStudentAnalytics)

export default router