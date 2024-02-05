import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const isUsed = await UserModel.findOne({ email });
        if (isUsed) {
            return res
                .status(500)
                .json({ message: "Such a user aleready exists" });
        }

        const salt = bcrypt.genSaltSync(7);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new UserModel({
            username,
            email,
            password: hashPassword,
        });

        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        await newUser.save();

        res.status(200).json({
            newUser,
            token,
            message: "Registration was successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Registration was failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res
                .status(500)
                .json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res
                .status(500)
                .json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.status(200).json({
            user,
            token,
            message: "Authorization was successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Authorization was failed" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(500).json({ message: "No such a user exists" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.status(200).json({ user, token, message: "User is auth now" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "No access" });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
            user.avatar = `${fileName}`;
            await user.save();
        }
        res.status(200).json({ user, message: "Avatar uploaded successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Uploading avatar failed" });
    }
};

export const deleteAvatar = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        user.avatar = "";
        await user.save();
        res.status(200).json({ user, message: "Avatar deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Deleting avatar failed" });
    }
};
