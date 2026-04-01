import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addCourse, deleteCourse, deleteProfessor, deleteStudent, getAllCourses, getAllProfessors, getAllStudents 
} from "../controllers/admin.controller.js"
import { authorizeRoles } from "../middlewares/rbac.middleware.js"

const router = Router()
router.route("/courses").post(verifyJWT, authorizeRoles("Admin"), addCourse)
router.route("/courses/:courseId").delete(verifyJWT, authorizeRoles("Admin"), deleteCourse)
router.route("/courses").get(verifyJWT, authorizeRoles("Admin"), getAllCourses)
router.route("/professor").get(verifyJWT, authorizeRoles("Admin"), getAllProfessors)
router.route("/students").get(verifyJWT, authorizeRoles("Admin"), getAllStudents)
router.route("/professor/:professorId").delete(verifyJWT, authorizeRoles("Admin"), deleteProfessor)
router.route("/students/:studentId").delete(verifyJWT, authorizeRoles("Admin"), deleteStudent)

export default router