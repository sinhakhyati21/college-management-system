import { Router } from "express"
import {
    addFirstAdmin,
    registerUser,
    setPassword,
    login,
    forgotPassword,
    resetPassword,
    verify2FA,
    refreshToken,
    logout,
} from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/rbac.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/add-first-admin").post(
    upload.fields([{ name: "photo", maxCount: 1 }]),
    addFirstAdmin
)
router.route("/register").post(
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "signature", maxCount: 1 }
    ]),
    registerUser
)
router.route("/set-password").post(setPassword)
router.route("/login").post(login)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/verify-2fa").post(verify2FA)
router.route("/refresh-token").post(refreshToken)
router.route("/logout").post(verifyJWT, logout)

export default router