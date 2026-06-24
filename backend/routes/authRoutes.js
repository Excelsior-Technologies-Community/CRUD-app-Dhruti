import express from "express";

import {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,

} from "../controller/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

// forgot password
router.post(
  "/forgot-password",
  forgotPassword
);

// verify OTP
router.post(
  "/verify-otp",
  verifyOtp
);

// reset password
router.post(
 "/reset-password",
 resetPassword
);

export default router;