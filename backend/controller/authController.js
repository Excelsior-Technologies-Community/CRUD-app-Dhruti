import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    // temp password
    const tempPassword = Math.random().toString(36).slice(-8);
    // hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // sendMail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Temporary Password",
      text: `Your temporary password is ${tempPassword}`,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// changePassword
export const changePassword = async (req, res) => {
  try {

    console.log("req.user:", req.user);

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // generate otp
    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    // OTP Expiry
    user.otp = otp;
    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // sent mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// verify otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP Verified",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "User not found",
        });
    }
    if (user.otp !== otp) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid OTP",
        });
    }

    if (
      user.otpExpiry <
      Date.now()
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "OTP Expired",
        });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful, Now you can LogIN",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}