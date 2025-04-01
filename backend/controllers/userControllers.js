import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

// ✅ User authentication (Login)
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  console.log("Incoming data:", req.body); // ✅ Debugging log

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic:
      pic ||
      "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg",
  });

  if (user) {
    console.log("Saved user:", user); // ✅ Debugging log

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic, // ✅ Ensure this returns correct image
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
// ✅ Export functions properly
export { authUser, registerUser, allUsers };
