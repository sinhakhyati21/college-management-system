import { ApiError } from "../utils/ApiError.js"

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next()
        } else {
            next(new ApiError(403, "Access denied - you don't have permission to access this resource"))
        }
    }
}

export { authorizeRoles }
