import express from 'express'
import cors from "cors";
import userRouter from "./routers/userRoutes.js"
import blogRouter from "./routers/BlogRoutes.js"
import dbConnection from './config/db.js'
import mediaRoutes from "./routers/MediaRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js"
import adminRoutes from "./routers/adminRoutes.js"
import authRoutes from "./routers/authRoutes.js"
const app = express()

dbConnection()

app.use(express.json());


app.use(cors({
  origin: ["http://localhost:5173","https://ink-pixel.onrender.com","http://localhost:5174"],
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

app.listen(Port, () => {
  console.log(` Server is running at http://localhost:${Port}`)
})
