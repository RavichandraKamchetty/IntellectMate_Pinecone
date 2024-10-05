import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (request, response) => {
    try {
        const { postedBy, text } = request.body;
        let { img } = request.body;

        if (!postedBy || !text)
            return response
                .status(400)
                .send({ error: "PostedBy and text fields are required" });

        const user = await User.findById(postedBy);

        if (!user)
            return response.status(400).send({ error: "User not found" });

        if (user._id.toString() !== request.user._id.toString()) {
            return response
                .status(400)
                .send({ error: "Unauthorized to create post" });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return response.status(400).send({
                error: `Text must be less than ${maxLength} characters`,
            });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ postedBy, text, imageURL: img });

        await newPost.save();

        user.posts.push(newPost._id);
        await user.save();

        response.status(201).send(newPost);
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in creating post: ", error.message);
    }
};

const getPost = async (request, response) => {
    try {
        const { id } = request.params;

        const post = await Post.findById(id);

        if (!post)
            return response.status(404).send({ error: "Post not found" });

        response.status(200).send({ post });
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in getting post: ", error.message);
    }
};

const deletePost = async (request, response) => {
    try {
        const { id } = request.params;

        const post = await Post.findById(id);

        if (!post)
            return response.status(404).send({ error: "Post not found" });

        if (post.postedBy.toString() !== request.user._id.toString()) {
            return response
                .status(400)
                .send({ error: "Unauthorized to delete post" });
        }

        if (post.imageURL) {
            const imgId = post.imageURL.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        const user = await User.findById(post.postedBy);
        user.posts = user.posts.filter((postId) => postId !== id);

        await user.save();

        await Post.findByIdAndDelete(id);

        response.status(200).send({ message: "Deleted Post Successfully" });
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in deleting post: ", error.message);
    }
};

const likeUnlikePost = async (request, response) => {
    try {
        const { id: postId } = request.params;
        const userId = request.user._id;

        const post = await Post.findById(postId);

        if (!post)
            return response.status(404).send({ error: "Post not found" });

        const isLiked = post.likes.some(
            (like) => like.userId.toString() === userId.toString()
        );

        if (isLiked) {
            // Unlike the post
            post.likes = post.likes.filter(
                (like) => like.userId.toString() !== userId.toString()
            );
            await post.save();
            response.status(200).send({ message: "Post Unliked Successfully" });
        } else {
            // Fetch the user's profile picture
            const user = await User.findById(userId);
            if (!user) {
                return response.status(404).send({ error: "User not found" });
            }

            post.likes.push({
                userId,
                userProfilePic: user.profilePicURL,
            });
            await post.save();
            response.status(200).send({ message: "Post Liked Successfully" });
        }
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in like/unlike post: ", error.message);
    }
};

const commentToPost = async (request, response) => {
    try {
        const { text } = request.body;
        const { id: postId } = request.params;
        const userId = request.user._id;
        const userProfilePic = request.user.profilePicURL;
        const username = request.user.username;

        if (!text)
            return response
                .status(400)
                .send({ error: "Text field is required" });

        const post = await Post.findById(postId);
        if (!post)
            return response.status(404).send({ error: "Post not found" });

        const comment = { userId, text, userProfilePic, username, createdAt: Date.now() };

        post.comments.push(comment);
        await post.save();

        response.status(200).send(comment);
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in reply to post: ", error.message);
    }
};

const getFeedPosts = async (request, response) => {
    try {
        const userId = request.user._id;
        const user = await User.findById(userId);

        if (!user)
            return response.status(404).send({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({
            postedBy: { $in: following },
        }).sort({ createdAt: -1 });
        
        response.status(200).send(feedPosts);
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in getting feed posts: ", error.message);
    }
};

const getUserPosts = async (request, response) => {
    try {
        const { username } = request.params;
        console.log(username);

        const user = await User.findOne({ username: username });
        console.log(user);

        if (!user)
            return response.status(404).send({ error: "User not found" });

        const posts = await Post.find({ postedBy: user._id }).sort({
            createdAt: -1,
        });

        response.status(200).send(posts);
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in getting user posts: ", error.message);
    }
};

export {
    createPost,
    getPost,
    deletePost,
    likeUnlikePost,
    commentToPost,
    getFeedPosts,
    getUserPosts,
};
