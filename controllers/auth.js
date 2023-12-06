import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Set an appropriate expiration time
    });

    const { password, isAdmin, ...otherDetails } = newUser._doc;

    
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".maszaweb.pl",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("user", JSON.stringify(otherDetails), {
      httpOnly: false, 
      secure: true,
      sameSite: "none",
      domain: ".maszaweb.pl",
      maxAge: 60 * 60 * 1000,
    });
    
    return res.status(200).json(otherDetails);
  
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password: plainPassword } = req.body;

    if (!email || !plainPassword) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(plainPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });

    const { password, isAdmin, ...otherDetails } = user._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".maszaweb.pl",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("user", JSON.stringify(otherDetails), {
      maxAge: 60 * 60 * 1000,
      sameSite: "none",
      domain: ".maszaweb.pl"
    });

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    return res.status(200).json(otherDetails);
  } catch (err) {
    return res.status(500).json({ message: "Internal server message." });
  }
};

export const loginTestUser = async (req, res) => {
  try {

    const email = 'test@test.pl'
    const plainPassword = 'test1234'

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(plainPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });

    const { password, isAdmin, ...otherDetails } = user._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".maszaweb.pl",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("user", JSON.stringify(otherDetails), {
      maxAge: 60 * 60 * 1000,
      sameSite: "none",
      domain: ".maszaweb.pl"
    });

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    return res.status(200).json(otherDetails);
  } catch (err) {
    return res.status(500).json({ message: "Internal server message." });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("user");

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server message." });
  }
};