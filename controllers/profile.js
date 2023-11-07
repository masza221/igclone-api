import User from "../models/User.js";
import Post from "../models/Post.js";
import { createError } from "../utils/errorMessages.js";

export const getProfile = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("displayName email photoURL") // Replace 'User' with your user model name
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ user: id })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "displayName photoURL email",
      }
    })
      .sort("-createdAt");

    const userProfile = {
      user,
      posts,
    };

    res.status(200).json(userProfile);
  } catch (err) {
    next(createError("500", err));
  }
};
