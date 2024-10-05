import {
    Avatar,
    AvatarBadge,
    Box,
    Flex,
    Stack,
    Text,
    WrapItem,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const currentUser = useRecoilValue(userAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );

    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={3}
            _hover={{
                cursor: "pointer",
                bg: "gray.dark",
            }}
            color={"white"}
            borderRadius={"md"}
            onClick={() =>
                setSelectedConversation({
                    _id: conversation._id,
                    userId: user._id,
                    username: user.username,
                    userProfilePic: user.profilePicURL,
                    mock: conversation.mock,
                })
            }
            bg={selectedConversation?._id === conversation._id && "gray.dark"}
        >
            <WrapItem>
                <Avatar size={"md"} src={user?.profilePicURL}>
                    {isOnline ? (
                        <AvatarBadge boxSize={"1em"} bg={"green.500"} />
                    ) : (
                        ""
                    )}
                </Avatar>
            </WrapItem>

            <Stack
                direction={"column"}
                fontSize={"sm"}
                display={{ base: "none", lg: "block" }}
            >
                <Text fontWeight={700} alignItems={"center"}>
                    {user?.username}
                </Text>
                <Text
                    fontSize={"xs"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                >
                    {lastMessage.sender === currentUser._id ? (
                        <Box color={lastMessage.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16} />
                        </Box>
                    ) : (
                        ""
                    )}
                    {lastMessage.text.length > 36
                        ? lastMessage.text.substring(0, 36) + "..."
                        : lastMessage.text || (
                              <Flex gap={1} alignItems={"center"}>
                                  <BsFillImageFill size={12} />
                                  <Text>Sent an attachment</Text>
                              </Flex>
                          )}
                </Text>
            </Stack>
        </Flex>
    );
};

export default Conversation;
