import express from 'express'
const router = express.Router();
import { loginUser,registerUser,updateProfile, changePassword } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js'

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.put("/update", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router