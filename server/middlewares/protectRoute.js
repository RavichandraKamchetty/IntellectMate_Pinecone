import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (request, response, next) => {
    try {
        const token = request.cookies.jwt;

        if (!token)
            return response.status(401).send({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        request.user = user;

        next();
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in verifying token: ", error.message);
    }
};

export default protectRoute;
