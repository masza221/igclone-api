import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import { verifyUser } from "../utils/verifyToken.js";
import { getUser, getUserData } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/getUser", verifyUser, getUser)
router.post("/logout", logout)
router.get("/verify", verifyUser, getUserData)

export default router