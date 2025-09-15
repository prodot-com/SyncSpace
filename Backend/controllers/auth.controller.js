import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // ✅ needed for password hashing
import { User } from "../models/User.model.js";

// ✅ Utility to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// --------------------
// Register User
// --------------------
const registerUser = async (req, res) => {
  const { name, email, password, role, skills, portfolio, rate } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password, role, skills, portfolio, rate });
    await user.save();

    const token = generateToken(user._id);
    res
      .status(201)
      .json({ token, user, message: "Account Created Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Login User
// --------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({ token, user, message: "Successfully Signed In" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Get Profile
// --------------------
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Update Profile
// --------------------
const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, email, skills, portfolio, rate } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.skills = skills || user.skills;
    user.portfolio = portfolio || user.portfolio;
    user.rate = rate || user.rate;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
      token: generateToken(user._id), // refresh token if email changed
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Change Password
// --------------------
// Change Password (fixed)
const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both passwords" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check old password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // ✅ Just set new password (pre-save hook will hash it)
    user.password = newPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export { registerUser, loginUser, getProfile, updateProfile, changePassword };
