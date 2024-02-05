import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import postsRoute from "./routes/postsRoute.js";
import commentsRoute from "./routes/commentsRoute.js";
import fileUpload from "express-fileupload";

const app = express();
dotenv.config();

//constants
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL

//database
const mongooseConnect = async () => {
    try {
        mongoose
            .connect(
                MONGODB_URL
            )
            .then(() => console.log("MONGODB OK"));
    } catch (error) {
        console.log(error);
    }
};
mongooseConnect();

//middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static("uploads"));

//routes
app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);

app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`);
});
