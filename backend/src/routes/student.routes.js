// student.routes.js
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/rbac.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { submitAssignment, getMyAttendance, getMyGrades, getMyProgress } from "../controllers/student.controller.js"

const router = Router()

router.route("/assignments/submit").post(
    verifyJWT,
    authorizeRoles("Student"),
    upload.fields([{ name: "assignment", maxCount: 1 }]),
    submitAssignment
)
router.route("/attendance").get(verifyJWT, authorizeRoles("Student"), getMyAttendance)
router.route("/grades").get(verifyJWT, authorizeRoles("Student"), getMyGrades)
router.route("/progress").get(verifyJWT, authorizeRoles("Student"), getMyProgress)

export default router