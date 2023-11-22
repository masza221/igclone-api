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

export const getPostsPage = async (req, res, next) => {
  const limit = req.query.limit;
  const page = +req.params.page;
  try {
    const posts = await Post.find()
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
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

      const pages = Math.ceil(await Post.countDocuments() / limit);

    res.status(200).json({posts, pages, page});
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

    await savedPost.populate({
      path: "user",
      select: "displayName photoURL email"
    })

    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
}

export const likePost = async (req, res) => {
  const id = req.params.id;

  if(!req.user) {
    return res.status(401).json({ message: 'Not Loged' });
  }

  const userId = req.user.id;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

     const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();

    res.status(200).json(updatedPost.likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
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

    // Populate user field after saving the comment
    await newComment.populate({
      path: "user",
      select: "displayName photoURL email"
    })

    post.comments.push(newComment._id);

    await post.save();

    return res.status(200).json({ message: "The post has been commented", comment: newComment });
  } catch (err) {
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
    return res.status(500).json({ message: "An error occurred", error: err.message });
  }
}

export const removePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);

    if (!post) {
     res.status(404).json({message: "Not found"})
    }
    
    await post.deleteOne()
    await Comment.deleteMany({ _id: { $in: post.comments } });

   res.status(200).json({message: "Deleted"})
  } catch (err) {
    res.status(500).json({message: "Error", error: err.message})
  }
}

export const removeComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    // Find the comment to get the associated post ID
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: "not found, " + commentId });
    }

    const postId = comment.post;

    // Remove the comment
    await Comment.findByIdAndRemove(commentId);

    // Remove the comment reference from the post
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    res.status(200).json({ message: "Comment removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};