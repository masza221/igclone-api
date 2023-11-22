import User from "../models/User.js";
import { createError } from "../utils/errorMessages.js";

export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    const {password, ...restDetails } = updatedUser._doc

    res.cookie("user", JSON.stringify(restDetails), {
      httpOnly: false, 
      secure: true,
      sameSite: "none",
      domain: ".maszaweb.pl",      
    });

    res.status(200).json(restDetails);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(createError("500", err));
  }
}
export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(createError("500", err));
  }
}

export const getUserData = async (req,res,next)=>{

if (!req.user) return res.status(401).json("You are not authenticated!");


  try {
    const user = await User.findById(req.user.id);

    if(!user){
      return res.status(404).json("User not found");
    }
    const {password, ...otherDetails} = user._doc;
     res.status(200).json(otherDetails);
  }
  catch(err){

    next(err);
  }
}


export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find(req.params.id);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}