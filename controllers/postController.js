import PostModel from "../models/PostModel.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import UserModel from "../models/UserModel.js";
import CommentModel from "../models/CommentModel.js";

export const create = async (req, res) => {
    try {
        const { title, text, type } = req.body;
        const user = await UserModel.findById(req.userId);

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

            const newPostWithImage = new PostModel({
                username: user.username,
                title,
                text,
                type,
                imageUrl: fileName,
                author: req.userId,
            });

            await newPostWithImage.save();
            await UserModel.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage },
            });

            return res.json(newPostWithImage);
        }

        const newPostWithoutImage = new PostModel({
            username: user.username,
            title,
            text,
            type,
            imageUrl: "",
            author: req.userId,
        });
        await newPostWithoutImage.save();
        await UserModel.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage },
        });
        res.json(newPostWithoutImage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Creating post was failed" });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("author").exec();
        const freelancePosts = await PostModel.find({ type: "Freelance" })
            .populate("author")
            .exec();
        const essentialsPosts = await PostModel.find({ type: "Essentials" })
            .populate("author")
            .exec();
        const howNotToPosts = await PostModel.find({ type: "How not to" })
            .populate("author")
            .exec();
        const uiDesignPosts = await PostModel.find({ type: "UI Design" })
            .populate("author")
            .exec();
        const uxDesignPosts = await PostModel.find({ type: "UX Design" })
            .populate("author")
            .exec();
        const typographyPosts = await PostModel.find({ type: "Typography" })
            .populate("author")
            .exec();
        const seoPosts = await PostModel.find({ type: "SEO" })
            .populate("author")
            .exec();
        const popularPosts = await PostModel.find().limit(4).sort("-viewsCount");
        res.status(200).json({
            posts,
            popularPosts,
            freelancePosts,
            essentialsPosts,
            howNotToPosts,
            seoPosts,
            typographyPosts,
            uiDesignPosts,
            uxDesignPosts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Getting all posts was failed" });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const myPosts = await Promise.all(
            user.posts.map((post) => {
                return PostModel.findById(post._id);
            })
        );
        res.status(200).json(myPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Getting all user's posts was failed",
        });
    }
};

export const getPostsComments = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        const list = await Promise.all(
            post.comments.map((comment) => {
                return CommentModel.findById(comment);
            })
        );
        res.status(200).json(list);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Getting all user's posts was failed",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedDoc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: "Post was not found" });
        }

        res.status(200).json(updatedDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Getting a post failed" });
    }
};

export const remove = async (req, res) => {
    try {
        const post = await PostModel.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post was not found" });
        }
        await UserModel.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id },
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const update = async (req, res) => {
    try {
        const { title, text, type, id } = req.body;
        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post was not found" });
        }
        let fileName = Date.now().toString() + req.files.image.name;
        const __dirname = dirname(fileURLToPath(import.meta.url));
        req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

        post.title = title;
        post.text = text;
        post.type = type;
        post.imageUrl = fileName;

        await post.save();

        res.status(200).json({ post, message: "Post updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Updating a post failed" });
    }
};
