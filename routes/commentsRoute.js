import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { createComment } from "../controllers/commentsController.js";
const router = new Router();
router.post("/:id", checkAuth, createComment);

export default router;
