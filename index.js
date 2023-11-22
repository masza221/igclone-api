import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import postsRoute from "./routes/posts.js";
import uploadRoute from "./routes/upload.js";
import profileRoute from "./routes/profile.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import https from 'https';
import fs from 'fs';


const app = express();
dotenv.config();

// MongoDB connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error(error);
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!");
});

const allowedOrigins = ["http://localhost:80", "http://localhost:3000", "https://localhost:3000", "https://igclone.maszaweb.pl", "http://igclone.maszaweb.pl", "https://masza221-api.playit.gg:1255"]; // Replace with your actual frontend URL

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static('public'));


app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/profile", profileRoute);

app.get("/", (req,res,next) => {
    res.send(200).json("test")
})

const PORT = process.env.PORT || 8880;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connect();
})