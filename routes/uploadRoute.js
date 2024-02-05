import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { upload } from "../controllers/uploadController.js";

const router = new Router();

router.post("/", checkAuth, upload);

export default router;
