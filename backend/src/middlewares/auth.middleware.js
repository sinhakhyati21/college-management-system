import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized - No token provided")
        }

        let verifiedToken
        try {
            verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new ApiError(401, "Token expired. Please login again")
            }
            throw new ApiError(401, "Invalid token")
        }

        const user = await User.findById(verifiedToken.id).select("-password -twoFactorSecret -passwordResetToken")

        if (!user) {
            throw new ApiError(401, "User no longer exists")
        }

        if (!user.isActive) {
            throw new ApiError(403, "Your account has been deactivated. Contact admin")
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export { verifyJWT }