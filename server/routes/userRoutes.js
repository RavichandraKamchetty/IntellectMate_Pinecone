import express from "express";
import {
    followOrUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    importUser,
    loginUser,
    logoutUser,
    signUpUser,
    updateUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import multer from "multer";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRoutes = express.Router();

userRoutes.use(bodyParser.urlencoded({ extended: true }));
userRoutes.use(bodyParser.json());
// Serve static files from the 'public' directory
userRoutes.use(express.static(path.resolve(__dirname, 'public')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public', 'uploads')); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

// Route for importing users - file upload
userRoutes.post('/importUser', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Call the controller method to handle the rest of the import logic
    importUser(req, res);
});

userRoutes.get("/profile/:query", getUserProfile);
userRoutes.get("/suggested", protectRoute, getSuggestedUsers);
userRoutes.post("/signup", signUpUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);
userRoutes.post("/follow/:id", protectRoute, followOrUnfollowUser);
userRoutes.put("/update/:id", protectRoute, updateUser);

export default userRoutes; 
