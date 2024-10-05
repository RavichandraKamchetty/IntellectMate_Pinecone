import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    Skeleton,
    SkeletonCircle,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Conversation from "../../components/Chat/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../../components/Chat/MessageContainer";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    conversationsAtom,
    selectedConversationAtom,
} from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";

const ChatPage = () => {
    const showToast = useShowToast();
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );

    const [searchText, setSearchText] = useState("");
    const [searchingUser, setSearchingUser] = useState(false);
    const currentUser = useRecoilValue(userAtom);

    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        socket?.on("messagesSeen", ({ conversationId }) => {
            setConversations((prevConvs) => {
                const updatedConversations = prevConvs.map((conversation) => {
                    if (conversation._id === conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
        });
    }, [socket, setConversations]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data);
                setConversations(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                return;
            } finally {
                setLoadingConversations(false);
            }
        };
        getConversations();
    }, [showToast]);

    const handleConversationSearch = async (e) => {
        e.preventDefault();

        setSearchingUser(true);

        try {
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();

            if (searchedUser.error) {
                showToast("Error", searchedUser.error, "error");
                return;
            }

            const messagingYourself = searchedUser._id === currentUser._id;
            if (messagingYourself) {
                showToast("Error", "You cannot message yourself", "error");
                return;
            }

            // if conversation already exists
            const conversationAlreadyExists = conversations.find(
                (conversation) =>
                    conversation.participants[0]._id === searchedUser._id
            );

            if (conversationAlreadyExists) {
                setSelectedConversation({
                    _id: conversationAlreadyExists._id,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePicURL,
                });
                return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: "",
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePicURL: searchedUser.profilePicURL,
                    },
                ],
            };

            setConversations((prevConvs) => [...prevConvs, mockConversation]);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setSearchingUser(false);
        }
    };

    return (
        <Flex mx={"auto"}>
            <Flex
                direction={"column"}
                gap={2}
                height={"100vh"}
                maxW={{ base: "100px", lg: "full" }}
                w={"400px"}
                py={8}
                position={"sticky"}
                top={"0px"}
                left={"70px"}
                borderRight={"1px solid"}
                borderColor={"whiteAlpha.400"}
                px={{ base: 2, md: 4 }}
            >
                <Text
                    fontWeight={700}
                    color={"gray.400"}
                    display={{ base: "none", lg: "block" }}
                >
                    Your Conversations
                </Text>
                <form onSubmit={handleConversationSearch}>
                    <Flex alignItems={"center"} gap={2}>
                        <Input
                            placeholder="Search for a user"
                            display={{ base: "none", lg: "block" }}
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                        />
                        <Button
                            size={"sm"}
                            display={{ base: "none", lg: "block" }}
                            onClick={handleConversationSearch}
                        >
                            <SearchIcon />
                        </Button>
                    </Flex>
                </form>

                {loadingConversations &&
                    [0, 1, 2, 3, 4].map((_, i) => (
                        <Flex
                            key={i}
                            alignItems={"center"}
                            gap={4}
                            p={1}
                            borderRadius={"md"}
                        >
                            <Box>
                                <SkeletonCircle size={10} />
                            </Box>
                            <Flex w={"full"} flexDirection={"column"} gap={3}>
                                <Skeleton h={"10px"} w={"100px"} />
                                <Skeleton h={"8px"} w={"90%"} />
                            </Flex>
                        </Flex>
                    ))}

                {!loadingConversations &&
                    conversations.map((conversation) => (
                        <Conversation
                            key={conversation._id}
                            isOnline={onlineUsers.includes(
                                conversation.participants[0]?._id
                            )}
                            conversation={conversation}
                        />
                    ))}
            </Flex>

            {!selectedConversation?._id && (
                <Flex
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    borderRadius={"md"}
                    p={2}
                    h={"100vh"}
                    w={{ base: "calc(100% - 100px)", lg: "calc(100% - 400px)" }}
                >
                    <GiConversation size={100} />
                    <Text fontSize={20}>
                        Select a conversation to start messaging
                    </Text>
                </Flex>
            )}

            {selectedConversation?._id && <MessageContainer />}
        </Flex>
    );
};

export default ChatPage;
