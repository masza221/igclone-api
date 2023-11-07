import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photoURL: {
      type: String,
      default: "https://maszaweb.pl:1256/uploads/young-businessman-icon.png",
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
