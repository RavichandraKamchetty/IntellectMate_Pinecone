import {
    Avatar,
    Divider,
    Flex,
    Skeleton,
    SkeletonCircle,
    useColorModeValue,
    Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    conversationsAtom,
    selectedConversationAtom,
} from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";
import messageSound from "../../assets/sounds/message.mp3";

const MessageContainer = () => {
    const showToast = useShowToast();
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );

    const setConversation = useSetRecoilState(conversationsAtom);

    const currentUser = useRecoilValue(userAtom);
    const messageEndRef = useRef(null);

    const { socket } = useSocket();

    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedConversation._id === message.conversationId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }

            if (!document.hasFocus()) {
                const sound = new Audio(messageSound);
                sound.play();
            }

            setConversation((prevConvs) => {
                const updatedConversations = prevConvs.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender,
                            },
                        };
                    }

                    return conversation;
                });

                return updatedConversations;
            });
        });
        return () => socket.off("newMessage");
    }, [socket, selectedConversation, setConversation]);

    useEffect(() => {
        const lastMessageIsFromOtherUser =
            messages.length &&
            messages[messages.length - 1].sender !== currentUser._id;

        if (lastMessageIsFromOtherUser) {
            socket.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            });
        }

        socket.on("messagesSeen", ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true,
                            };
                        }
                        return message;
                    });

                    return updatedMessages;
                });
            }
        });
    }, [socket, currentUser._id, messages, selectedConversation]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, [messages]);

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);

            try {
                if (selectedConversation.mock) return;

                const res = await fetch(
                    `/api/messages/${selectedConversation?.userId}`
                );

                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }

                console.log("messages: ", data);
                setMessages(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                return;
            } finally {
                setLoadingMessages(false);
            }
        };

        getMessages();
    }, [showToast, selectedConversation.userId, selectedConversation.mock]);

    return (
        <Flex
            height={"100vh"}
            w={{ base: "calc(100% - 100px)", lg: "calc(100% - 400px)" }}
            p={2}
            position={"sticky"}
            top={"0px"}
            left={"0px"}
            px={{ base: 2, md: 4 }}
            borderRadius={"md"}
            bg={"gray.dark"}
            direction={"column"}
        >
            {/* Message Header */}
            <Flex w={"full"} h={16} alignItems={"center"} gap={2}>
                <Avatar size={"sm"} src={selectedConversation.userProfilePic} />
                <Text>{selectedConversation.username}</Text>
            </Flex>

            <Divider />

            <Flex direction={"column"} gap={4} my={4} p={2} overflowY={"auto"}>
                {loadingMessages &&
                    [...Array(8)].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={"center"}
                            p={1}
                            borderRadius={"md"}
                            alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex direction={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"250px"} />
                                <Skeleton h={"8px"} w={"250px"} />
                                <Skeleton h={"8px"} w={"250px"} />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))}

                {!loadingMessages &&
                    messages.map((message) => (
                        <Flex
                            key={message._id}
                            direction={"column"}
                            ref={
                                messages.length - 1 ===
                                messages.indexOf(message)
                                    ? messageEndRef
                                    : null
                            }
                        >
                            <Message
                                message={message}
                                ownMessage={currentUser._id === message.sender}
                            />
                        </Flex>
                    ))}
            </Flex>

            <MessageInput setMessages={setMessages} />
        </Flex>
    );
};

export default MessageContainer;
