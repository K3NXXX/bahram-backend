import mongoose from "mongoose";

const PostModel = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        likes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        imageUrl: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Post", PostModel);
