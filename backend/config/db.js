const mongoose = require("mongoose");

async function connectDB() {
    try {
        // console.log("ENV URI:", process.env.MONGODB_URI); // debug
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected ✅");
    } catch (err) {
        console.log("MongoDB Error ❌", err);
    }
}

module.exports = connectDB;