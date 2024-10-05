import express from "express";
import {
    createPost,
    deletePost,
    getPost,
    likeUnlikePost,
    commentToPost,
    getFeedPosts,
    getUserPosts,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const postRoutes = express.Router();

postRoutes.get("/feed", protectRoute, getFeedPosts);
postRoutes.get("/:id", getPost);
postRoutes.get('/user/:username', protectRoute, getUserPosts)
postRoutes.post("/create", protectRoute, createPost);
postRoutes.delete("/:id", protectRoute, deletePost);
postRoutes.put("/like/:id", protectRoute, likeUnlikePost);
postRoutes.put("/comment/:id", protectRoute, commentToPost);

export default postRoutes;
