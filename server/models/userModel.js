import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minLength: 6,
            required: true,
        },
        // CSV data storage in mongodb

        age: {
            type: Number,
            min: 18,
            max: 25,
            default: 18,  
        },
        sex: {
            type: String,
            default: "",
        },
        major: {
            type: String,
            default: "",
            required: true,
        },
        year: {
            type: String,
            default: "",
        },
        gpa: {
            type: Number,  
            min: 0.0,      
            default: 0.0,  
        },
        hobbies: {
            type: [String],
            default: [],
            required: true,
        },
        country: {
            type: String,
            default: "",
            required: true,
        },
        state: {
            type: String,
            default: "",
        },
        uniqueQuality: {
            type: String,
            default: "",
            required: true,
        },
        bio: {
            type: String,
            default: "",
            required: true,
        },
        userid: {
            type: String,
            default: "",
        },

        // CSV data storage in mongodb

        profilePicURL: {
            type: String,
            default: "",
        },
        followers: {
            type: [String],
            default: [],
        },
        following: {
            type: [String],
            default: [],
        },
        posts: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
