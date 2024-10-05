import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import { app, server } from "./socket/socket.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 4000;

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Increase payload limit
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// middlewares
app.use(express.json()); // To parse JSON data in the request.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the request.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log(`Server running at port number ${PORT}...`);
});

const invalidPathHandlingMiddleware = (request, response, next) => {
    response.send({ message: "Invalid Path" });
};
app.use(invalidPathHandlingMiddleware);

// const errHandler = (error, request, response, next) => {
//     console.log("why like this🥲")
//     response.status(404).send({ "error-message": error.message });
// };
// app.use(errHandler);
