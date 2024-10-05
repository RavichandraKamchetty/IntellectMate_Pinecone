import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

const sendMessage = async (request, response) => {
    try {
        const { recipientId, message } = request.body;
        let { img } = request.body;
        const senderId = request.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });

            await conversation.save();
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            img: img || "",
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            }),
        ]);

        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId)
            io.to(recipientSocketId).emit("newMessage", newMessage);

        response.status(201).send(newMessage);
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in sending message: ", error.message);
    }
};

const getMessages = async (request, response) => {
    const { otherUserId } = request.params;
    const userId = request.user._id;

    try {
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) {
            return response
                .status(404)
                .send({ error: "Conversation not found" });
        }

        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 });

        response.status(201).send(messages);
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in getting messages: ", error.message);
    }
};

const getConversations = async (request, response) => {
    const userId = request.user._id;

    try {
        const conversations = await Conversation.find({
            participants: userId,
        }).populate({
            path: "participants",
            select: "username profilePicURL",
        });

        // remove the current user from participants array
        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(
                (participant) =>
                    participant._id.toString() !== userId.toString()
            );
        });

        response.status(200).send(conversations);
    } catch (error) {
        response.status(500).json({ error: error.message });
        console.log("Error in getting conversations: ", error.message);
    }
};

export { sendMessage, getMessages, getConversations };
