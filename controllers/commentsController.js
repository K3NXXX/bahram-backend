import CommentModel from "../models/CommentModel.js";
import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";

export const createComment = async (req, res) => {
    try {
        const { id, comment } = req.body;
        const user = await UserModel.findById(req.userId);
        if (!comment) {
            return res
                .status(500)
                .json({ message: "Comment can not be empty" });
        }
        const newComment = new CommentModel({
            comment,
            username: user.username,
            avatar: user.avatar,
        });
        await newComment.save();

        await PostModel.findByIdAndUpdate(id, {
            $push: { comments: newComment._id },
        });

        res.status(200).json(newComment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Creating comment failed" });
    }
};
