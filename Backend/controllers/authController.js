import { UserModel } from "../model/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const register = async (req, res) => {
    try {
        const { name, email, password, profile, role } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await UserModel.create
            ({
                name,
                email,
                password: hashedPassword,
                profile,
                role,
            })
        res.json({
            message: "user created succsefully",
            status: true,
            user: newuser

        })
    } catch (error) {
        console.error("Error registering user:", error);
        res.json({
            message: "Internal Server Error",
            status: false,
            error: error.message,
        });

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email }).select("+password");


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // create reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // save token in database with expiry
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // send email
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset link sent to email" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user by reset token
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const hashed = await bcrypt.hash(password, 10);

        user.password = hashed;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: "Password reset successful!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
