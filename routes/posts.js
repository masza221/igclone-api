import express from "express";
import {
  updatePost,
  getPost,
  getPosts,
  createPost,
  likePost,
  commentPost,
  getPostCommentsWithUserData,
  removePost,
  removeComment,
  getPostsPage
} from "../controllers/post.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updatePost);

//DELETE
router.delete("/:id", removePost);

//GET
router.get("/:id", verifyUser, getPost);

//GET ALL
router.get("/all", getPosts);

//GET Page
router.get("/page/:page", getPostsPage);

//CREATE
router.post("/createPost", verifyUser, createPost);

router.put("/likePost/:id", verifyUser, likePost);

router.get("/getComments/:id", getPostCommentsWithUserData);
router.put("/commentPost/:id", verifyUser, commentPost);
router.delete("/commentRemove/:id", verifyUser, removeComment)


export default router;