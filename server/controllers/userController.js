// import expressAsyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/postModel.js";
import csv from "csvtojson";
import axios from "axios";
import crypto from "crypto";

const importUser = async (request, response) => {
    try {
        let userData = [];
        let usedEmails = new Set(); // Track used emails
        let usedUsernames = new Set(); // Track used usernames
        let usedFullNames = new Set(); // Track used full names

        await csv()
            .fromFile(request.file.path)
            .then(async (csvData) => {
                for (let x = 0; x < 0; x++) {
                    // Extract the name and remove spaces
                    let name = csvData[x].Name.replace(
                        /\s+/g,
                        ""
                    ).toLowerCase();
                    let email = `${name}@gmail.com`;
                    let fullName = csvData[x].Name;

                    // Ensure hobbies are handled as an array
                    const hobbiesArray = csvData[x].Hobbies
                        ? csvData[x].Hobbies.replace(/[\[\]']/g, "") // Remove brackets and quotes
                              .split(",")
                              .map((hobby) => hobby.trim())
                        : [];

                    // Generate unique email if needed
                    if (
                        usedEmails.has(email) ||
                        (await User.findOne({ email }))
                    ) {
                        let duplicateCounter = 1;
                        while (
                            usedEmails.has(email) ||
                            (await User.findOne({ email }))
                        ) {
                            email = `${name}${duplicateCounter}@gmail.com`;
                            duplicateCounter++;
                        }
                    }
                    usedEmails.add(email); // Mark this email as used

                    // Generate unique username if needed
                    if (
                        usedUsernames.has(name) ||
                        (await User.findOne({ username: name }))
                    ) {
                        let dup = 1;
                        while (
                            usedUsernames.has(name) ||
                            (await User.findOne({ username: name }))
                        ) {
                            name = `${csvData[x].Name.replace(
                                /\s+/g,
                                ""
                            ).toLowerCase()}${dup}`;
                            dup++;
                        }
                    }
                    usedUsernames.add(name); // Mark this username as used

                    // Generate unique full name if needed
                    if (
                        usedFullNames.has(fullName) ||
                        (await User.findOne({ fullName }))
                    ) {
                        let dup2 = 1;
                        while (
                            usedFullNames.has(fullName) ||
                            (await User.findOne({ fullName }))
                        ) {
                            fullName = `${csvData[x].Name}${dup2}`;
                            dup2++;
                        }
                    }
                    usedFullNames.add(fullName); // Mark this full name as used

                    const password = `${name}123`;

                    // Hash the password
                    const salt = await bcryptjs.genSalt(10);
                    const hashedPassword = await bcryptjs.hash(password, salt);

                    userData.push({
                        email: email,
                        username: name,
                        fullName: fullName,
                        password: hashedPassword,
                        age: csvData[x].Age,
                        sex: csvData[x].Sex,
                        major: csvData[x].Major,
                        year: csvData[x].Year,
                        gpa: csvData[x].GPA,
                        hobbies: hobbiesArray,
                        country: csvData[x].Country,
                        state: csvData[x]["State/Province"],
                        uniqueQuality: csvData[x]["Unique Quality"],
                        bio: csvData[x].Story,
                        userid: csvData[x].userid || "",
                    });
                    console.log(`Processed user ${x}: ${email}`);
                }

                await User.insertMany(userData);
                response
                    .status(200)
                    .send({ message: "Users imported successfully" });
            })
            .catch((error) => {
                throw new Error(`CSV processing error: ${error.message}`);
            });
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in importUser: ", error.message);
    }
};

function generateUniqueKey(length = 7) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

async function generateUniqueUserId() {
    let isUnique = false;
    let userId;

    while (!isUnique) {
        userId = generateUniqueKey();
        const existingUser = await User.findOne({ userid: userId });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return userId;
}

const signUpUser = async (request, response) => {
    try {
        const {
            email,
            username,
            fullName,
            password,
            major,
            hobbies,
            country,
            uniqueQuality,
            bio,
        } = request.body;

        const user = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (user) {
            return response.status(400).json({ error: "User already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Convert hobbies to an array by splitting the comma-separated string
        const hobbiesArray = hobbies.split(",").map((hobby) => hobby.trim());

        // Generate unique user ID
        const userId = await generateUniqueUserId();

        const newUser = new User({
            email,
            username,
            fullName,
            password: hashedPassword,
            major,
            hobbies: hobbiesArray,
            country,
            uniqueQuality,
            bio,
            userid: userId, // Set the generated userid here
        });

        await newUser.save();

        if (newUser) {
            // Call Python API to insert user features into Pinecone
            try {
                const insertData = {
                    userid: newUser.userid,
                    story: newUser.bio,
                    major: newUser.major,
                    hobbies: newUser.hobbies.join(","),
                    country: newUser.country,
                    unique_quality: newUser.uniqueQuality,
                };

                await axios.post(
                    "http://127.0.0.1:5000/api/insert",
                    insertData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            } catch (insertError) {
                console.log(
                    "Error inserting user into Pinecone:",
                    insertError.message
                );
                // Handle this error appropriately, maybe log or retry mechanism
            }

            generateTokenAndSetCookie(newUser._id, response);

            response.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                fullName: newUser.fullName,
                bio: newUser.bio,
                profilePicURL: newUser.profilePicURL,
                major: newUser.major,
                hobbies: newUser.hobbies,
                country: newUser.country,
                uniqueQuality: newUser.uniqueQuality,
                bio: newUser.bio,
                userid: newUser.userid, // Include the generated userid in the response
            });
        } else {
            response.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in signUpUser: ", error.message);
    }
};

const loginUser = async (request, response) => {
    try {
        const { email, password } = request.body;
        //query can be email or username

        const user = await User.findOne({ email });

        if (user === null) {
            return response
                .status(400)
                .send({ error: "Invalid email/username" });
        }

        let isEqual = await bcryptjs.compare(password, user.password);
        if (isEqual === false)
            return response.status(400).send({ error: "Invalid password" });

        generateTokenAndSetCookie(user._id, response);

        return response.status(201).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            bio: user.bio,
            profilePicURL: user.profilePicURL,
            major: user.major,
            hobbies: user.hobbies,
            country: user.country,
            uniqueQuality: user.uniqueQuality,
            bio: user.bio,
        });
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in signupUser: ", error.message);
    }
};

const logoutUser = async (request, response) => {
    try {
        response.cookie("jwt", "", { maxAge: 1 });
        response.status(200).send({ message: "User logged out successfully" });
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in logoutUser: ", error.message);
    }
};

const followOrUnfollowUser = async (request, response) => {
    try {
        const { id } = request.params;

        const currentUser = await User.findById(request.user._id);
        const userToFollowOrUnfollow = await User.findById(id);

        if (id === request.user._id.toString())
            return response
                .status(400)
                .send({ error: "You cannot follow/unfollow yourself" });

        if (!userToFollowOrUnfollow || !currentUser)
            return response.status(400).send({ error: "User not found" });

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // unfollow
            // Modify current User following, modify followers of userToFollowOrUnfollow
            await User.findByIdAndUpdate(request.user._id, {
                $pull: { following: id },
            });
            await User.findByIdAndUpdate(id, {
                $pull: { followers: request.user._id },
            });
            response
                .status(200)
                .send({ message: "User Unfollowed Successfully" });
        } else {
            // follow

            await User.findByIdAndUpdate(request.user._id, {
                $push: { following: id },
            });
            await User.findByIdAndUpdate(id, {
                $push: { followers: request.user._id },
            });

            response
                .status(200)
                .send({ message: "User Followed Successfully" });
        }
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in follow/unfollow user: ", error.message);
    }
};

const updateUser = async (request, response) => {
    const {
        email,
        username,
        fullName,
        password,
        bio,
        major,
        hobbies,
        state,
        age,
        sex,
        gpa,
        uniqueQuality,
        year,
    } = request.body;
    let { profilePicURL } = request.body;

    const { id } = request.params;
    const userId = request.user._id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return response.status(400).send({ error: "User not found" });
        }

        if (id !== userId.toString()) {
            return response
                .status(400)
                .send({ message: "You cannot update other users" });
        }

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
            user.password = hashedPassword;
        }

        if (profilePicURL) {
            console.log(profilePicURL);
            if (user.profilePicURL) {
                await cloudinary.uploader.destroy(
                    user.profilePicURL.split("/").pop().split(".")[0]
                );
            }

            const uploadedResponse = await cloudinary.uploader.upload(
                profilePicURL
            );
            profilePicURL = uploadedResponse.secure_url;
        }

        user.email = email || user.email;
        user.username = username || user.username;
        user.fullName = fullName || user.fullName;
        user.profilePicURL = profilePicURL || user.profilePicURL;
        user.bio = bio || user.bio;

        // Updating the new fields
        user.major = major || user.major;
        user.hobbies = hobbies || user.hobbies;
        user.state = state || user.state;
        user.age = age || user.age;
        user.sex = sex || user.sex;
        user.gpa = gpa || user.gpa;
        user.uniqueQuality = uniqueQuality || user.uniqueQuality;
        user.year = year || user.year;

        user = await user.save();

        await Post.updateMany(
            { "comments.userId": userId },
            {
                $set: {
                    "comments.$[comment].username": user.username,
                    "comments.$[comment].userProfilePic": user.profilePicURL,
                },
            },
            {
                arrayFilters: [{ "comment.userId": userId }],
            }
        );

        // Remove the password field before sending the response
        user.password = null;

        response.status(200).send(user);
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in updating user: ", error.message);
    }
};

const getUserProfile = async (request, response) => {
    // We will fetch user profile either with username or userId
    // query is either username or userId

    const { query } = request.params;
    if (query == null) {
        return response.status(400).send({ error: "User not found" });
    }

    try {
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
            //query is userId

            user = await User.findOne({ _id: query })
                .select("-password")
                .select("-updatedAt");
        } else {
            // query is username
            console.log(query);
            user = await User.findOne({ username: query })
                .select("-password")
                .select("-updatedAt");

            console.log(user);
        }

        if (user == null)
            return response.status(400).send({ error: "User not found" });

        response.status(200).send(user);
    } catch (error) {
        response.status(500).json({ errorr: error.message });
        console.log("Error in getting user: ", error.message);
    }
};

// const getSuggestedUsers = async (request, response) => {
//     try {
//         // exclude the current user from suggested users array
//         // exclude users that current user is already following

//         const userId = request.user._id;

//         const usersFollowedByYou = await User.findById(userId).select(
//             "following"
//         );

//         const users = await User.aggregate([
//             {
//                 $match: { _id: { $ne: userId } },
//             },
//             {
//                 $sample: { size: 10 },
//             },
//         ]);

//         const filteredUsers = users.filter(
//             (user) => !usersFollowedByYou.following.includes(user._id)
//         );

//         const suggestedUsers = filteredUsers.slice(0, 4);

//         suggestedUsers.forEach((user) => (user.password = null));

//         response.status(200).send(suggestedUsers);
//     } catch (error) {
//         response.status(500).json({ errorr: error.message });
//         console.log("Error in suggested users: ", error.message);
//     }
// };

const getSuggestedUsers = async (request, response) => {
    try {
        const userId = request.user._id;
        const id = request.user.userid;
        console.log(id);

        // Exclude the current user and users they are already following
        const usersFollowedByYou = await User.findById(userId).select(
            "following"
        );

        // Get the current user's details to send to the recommendation service
        const currentUser = await User.findById(userId);

        // Prepare data to send to the recommendation API
        const postData = {
            story: currentUser.bio, // Assuming bio or some other field holds the story
            major: currentUser.major,
            hobbies: currentUser.hobbies.join(","), // Convert hobbies array to comma-separated string
            country: currentUser.country,
            unique_quality: currentUser.uniqueQuality,
        };

        // Call Python API to get recommended user IDs
        const pythonApiResponse = await axios.post(
            "http://127.0.0.1:5000/api/recommend",
            postData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Get the recommended user IDs from the response
        const recommendedUserIds = pythonApiResponse.data.recommendations;
        console.log("Wow: ", recommendedUserIds);

        // Fetch user details from the database using the recommended user IDs
        const recommendedUsers = await User.find({
            userid: { $in: recommendedUserIds },
        });

        // Filter out users who are already followed
        const filteredUsers = recommendedUsers.filter(
            (user) => !usersFollowedByYou.following.includes(user._id)
        );

        const filterUsers = filteredUsers.filter((user) => user.userid != id);

        // Limit the number of suggested users to 4
        const suggestedUsers = filterUsers.slice(0, 15);

        // Send the suggested users as a response
        response.status(200).send(suggestedUsers);
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in getSuggestedUsers: ", error.message);
    }
};

export {
    importUser,
    signUpUser,
    loginUser,
    logoutUser,
    followOrUnfollowUser,
    updateUser,
    getUserProfile,
    getSuggestedUsers,
};
