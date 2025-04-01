import mongoose from "mongoose"; // ✅ Correct for ES Modules
import bcrypt from "bcryptjs"; // ✅ Correct for ES Modules
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://iconarchive.com/download/i107284/Flat-User-Interface-Icons/User-Profile-2.ico",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// Hash the password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export const User = mongoose.model("User", userSchema);
export default User;
