import {
    Box,
    Flex,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
    conversationsAtom,
    selectedConversationAtom,
} from "../../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../../hooks/usePreviewImg";

const MessageInput = ({ setMessages }) => {
    const [messageText, setMessageText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversations = useSetRecoilState(conversationsAtom);
    const imageRef = useRef(null);
    const { onClose } = useDisclosure();
    const { selectedFile, handleImageChange, setSelectedFile } =
        usePreviewImg();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText && !selectedFile) return;

        if (isSending) return;
        setIsSending(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                    img: selectedFile
                }),
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            setMessages((messages) => [...messages, data]);

            setConversations((prevConvs) => {
                const updatedConversations = prevConvs.map((conversation) => {
                    if (conversation._id === selectedConversation._id) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: messageText,
                                sender: data.sender,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });

            setMessageText("");
            setSelectedFile("")
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box mt={"auto"}>
            <Flex gap={2} alignItems={"center"}>
                <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
                    <InputGroup>
                        <Input
                            w={"full"}
                            placeholder="Type a message"
                            onChange={(e) => setMessageText(e.target.value)}
                            value={messageText}
                        />
                        <InputRightElement
                            onClick={handleSendMessage}
                            cursor={"pointer"}
                        >
                            <IoSendSharp />
                        </InputRightElement>
                    </InputGroup>
                </form>

                <Flex flex={5} alignItems={"center"}>
                    <BsFillImageFill
                        size={20}
                        cursor={"pointer"}
                        onClick={() => imageRef.current.click()}
                    />
                    <Input
                        type="file"
                        hidden
                        ref={imageRef}
                        onChange={handleImageChange}
                    />
                </Flex>

                <Modal
                    isOpen={selectedFile}
                    onClose={() => {
                        onClose();
                        setSelectedFile("");
                    }}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex mt={5} w={"full"}>
                                <Image src={selectedFile} />
                            </Flex>
                            <Flex justifyContent={"flex-end"} my={4}>
                                {!isSending ? (
                                    <IoSendSharp
                                        size={24}
                                        cursor={"pointer"}
                                        onClick={handleSendMessage}
                                    />
                                ) : (
                                    <Spinner size={"md"} />
                                )}
                            </Flex>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Flex>
        </Box>
    );
};

export default MessageInput;
