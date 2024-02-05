import { Router } from "express";
import {
    deleteAvatar,
    getMe,
    login,
    register,
    uploadAvatar,
} from "../controllers/authController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = new Router();

//Register
router.post("/register", register);

//Login
router.post("/login", login);

//Get me
router.get("/getMe", checkAuth, getMe);

router.post("/avatar", checkAuth, uploadAvatar);

router.delete("/avatar", checkAuth, deleteAvatar);

export default router;
