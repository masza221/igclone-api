import express from "express";
import {
  updatePost,
  deletePost,
  getPost,
  getPosts,
  createPost,
  likePost,
  commentPost,
  getPostCommentsWithUserData
} from "../controllers/post.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updatePost);

//DELETE
router.delete("/:id", verifyUser, deletePost);

//GET
router.get("/:id", verifyUser, getPost);

//GET ALL
router.get("/", getPosts)

//CREATE
router.post("/createPost", verifyUser, createPost);

router.put("/likePost/:id", verifyUser, likePost);

router.get("/getComments/:id", getPostCommentsWithUserData);
router.put("/commentPost/:id", verifyUser, commentPost);

export default router;