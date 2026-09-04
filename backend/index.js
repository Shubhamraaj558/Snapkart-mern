require('dotenv').config();



const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const connectDB = require('./config/db')
const router = require('./routes')

const app = express()

// new coros
app.use(cors({
    origin: ["http://localhost:3000", "https://snapkart-mern.vercel.app"],
    credentials: true
}));

// old coros
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }))

// ✅ Increase body size limit
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

app.use(cookieParser())

app.use("/api", router)

const PORT = process.env.PORT || 8080

connectDB().then(() => {
    app.listen(PORT, () => {
        // console.log("connnect to DB")
        console.log("Server is running On Port No:- " + PORT)
        console.log("Proudly Engineered by Shubham.Kr – Crafting Smart Solutions with Precision & Passion")

    })
})
