import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, response) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });

        response.cookie("jwt", token, {
            httpOnly: true, //more secure
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            sameSite: "strict"            
        })

        return token;

    } catch (error) {
        response.status(500).json({ error: err.message });
        console.log("Generate Token Error: ", error.message);
    }
};

export default generateTokenAndSetCookie;
