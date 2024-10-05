import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        likes: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                userProfilePic: {
                    type: String,
                },
            },
        ],

        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                userProfilePic: {
                    type: String,
                },
                username: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            },
        ],
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        imageURL: {
            type: String,
        },
        text: {
            type: String,
            maxLength: 500,
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
