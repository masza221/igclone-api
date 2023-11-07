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

const allowedOrigins = ["http://site.maszaweb.pl:1255","https://maszaweb.pl:1255", "http://localhost:3000","https://localhost:3000"]; // Replace with your actual frontend URL

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

const PORT = process.env.PORT || 8880;

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('maszaweb.pl.certificate.pem'),
  ca: fs.readFileSync('maszaweb.pl.intermediate.pem')
};

const server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connect();
})