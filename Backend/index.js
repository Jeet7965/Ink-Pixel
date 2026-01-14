import express from 'express'
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRouter from "./routers/userRoutes.js"
import blogRouter from "./routers/BlogRoutes.js"
import dbConnection from './config/db.js'
import mediaRoutes from "./routers/MediaRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js"
import adminRoutes from "./routers/adminRoutes.js"
import authRoutes from "./routers/authRoutes.js"
import ReviewRoutes from './routers/reviewerRoutes.js';
const app = express()

dbConnection()

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: ["http://localhost:5173","https://inkpixel.netlify.app"],
  credentials: true,
}));




const Port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("Hey this is connected")
})
app.use("/auth",authRoutes)
app.use("/users",userRouter)
app.use("/blog",blogRouter)
app.use("/media",mediaRoutes)
app.use("/category",categoryRoutes)
app.use("/admin",adminRoutes)
app.use("/review",ReviewRoutes)

app.listen(Port, () => {
  console.log(` Server is running at http://localhost:${Port}`)
})
