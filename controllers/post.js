import Post from "../models/Post.js";
import mongoose from "mongoose";
import Comment from "../models/Comments.js";

export const updatePost = async (req,res,next)=>{
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
}

export const deletePost = async (req,res,next)=>{
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getPost = async (req,res,next)=>{
  try {
    const Post = await Post.findById(req.params.id);
    res.status(200).json(Post);
  } catch (err) {
    next(err);
  }
}
export const getPosts = async (req, res, next) => {
  try {
    const Posts = await Post.find()
      .populate({
        path: "comments",
        select: "comment user", 
        populate: {
          path: "user",
          select: "displayName photoURL email",
        }
      })
      .populate({
        path: "user",
        select: "displayName photoURL email"
      })
      .sort("-createdAt");

    res.status(200).json(Posts);
  } catch (err) {
    next(err);
  }
}

export const createPost = async (req,res,next)=>{
  try {
    const post = {
      ...req.body,
      user: req.user.id,
    }

    const newPost = new Post(post);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
}

export const likePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      comment,
      user: new mongoose.Types.ObjectId(req.user.id),
      post: new mongoose.Types.ObjectId(postId),
    });

    await newComment.save();

    post.comments.push(newComment._id);

    await post.save();

    return res.status(200).json({ message: "The post has been commented", comment: newComment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

export const getPostCommentsWithUserData = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User", // Replace with the actual User model name
          select: "displayName email photoURL", // Include the user fields you want to retrieve
        },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post.comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred", error: err.message });
  }
}
