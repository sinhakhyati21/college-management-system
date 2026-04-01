import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import fs from "fs"
import dotenv from "dotenv"
import userRouter from "./routes/auth.routes.js"
import adminRouter from "./routes/admin.routes.js"
import professorRouter from "./routes/professor.routes.js"
import studentRouter from "./routes/student.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js"

dotenv.config()

if (!fs.existsSync("./public/temp")) {
    fs.mkdirSync("./public/temp", { recursive: true })
}

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(helmet())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

app.use("/api/v1/auth", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/professor", professorRouter)
app.use("/api/v1/student", studentRouter)

app.use(errorHandler)

export { app }