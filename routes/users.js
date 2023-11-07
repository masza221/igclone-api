import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUserData
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", getUser);
router.get("/getUser/:id", getUser);

//GET ALL
router.get("/", getUsers);

export default router;