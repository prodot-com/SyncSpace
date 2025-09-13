import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

const registerUser = async (req, res) => {
  const { name, email, password, role, skills, portfolio, rate } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role, skills, portfolio, rate });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user, message: 'Account Created Successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user, message: "Successfully Signed In" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


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

export { registerUser, loginUser, getProfile };
