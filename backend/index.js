import express from "express"
import "dotenv/config"
import connectToDB from "./database/db.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./router/userRoutes.js"
import connectToClodinary from "./config/cloudinary.js"
const app = express()
const port = process.env.PORT

// connect to database

await connectToDB()
await connectToClodinary()
// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
// routers

app.use("/api/auth", authRouter)






app.get("/", (req, res) => {
    res.send("Hello world")

})


app.listen(port, () => {

    console.log(`server starting at http://localhost:${port}`)


})
