import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
    create,
    getAll,
    getMyPosts,
    getOne,
    getPostsComments,
    remove,
    update,
} from "../controllers/postController.js";

const router = new Router();

router.post("/", checkAuth, create);
router.get("/", getAll);
router.get("/:id", getOne);
router.get("/user/me", checkAuth, getMyPosts);
router.delete("/:id", checkAuth, remove);
router.put("/:id", checkAuth, update);
router.get("/comments/:id", getPostsComments);

export default router;
