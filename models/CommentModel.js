import mongoose from "mongoose";

const CommentModel = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        avatar: {
            type: String
        },
    },
    { timestamps: true }
);

export default mongoose.model("Comment", CommentModel);
