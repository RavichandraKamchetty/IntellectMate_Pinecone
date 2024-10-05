import {
    Avatar,
    Box,
    Button,
    CloseButton,
    Flex,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill } from "react-icons/bs";
import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import postsAtom from "../../atoms/postsAtom";
import { useLocation, useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreatePost = () => {
    const { pathname } = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const { selectedFile, handleImageChange, setSelectedFile } =
        usePreviewImg();

    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const [isLoading, setIsLoading] = useState(false);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { username } = useParams();

    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        setIsLoading(true);

        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    postedBy: user._id,
                    text: postText,
                    img: selectedFile,
                }),
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            showToast("Success", "Post created successfully", "success");
            if (username === user?.username) {
                setPosts([data, ...posts]);
            } 
            onClose();
            setPostText("");
            setSelectedFile("");
            setRemainingChar(MAX_CHAR);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Tooltip
                hasArrow
                label="Create"
                placement="right"
                ml={1}
                openDelay={500}
                display={{ base: "block", md: pathname == "/chat" ? "block" : "none"}}
            >
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: pathname == "/chat" ? 10 : "full" }}
                    justifyContent={{
                        base: "center",
                        md: pathname == "/chat" ? "center" : "flex-start"
                    }}
                    onClick={onOpen}
                >
                    <CreatePostLogo />
                    <Box
                        display={{ base: "none", md: pathname == "/chat" ? "none" : "block", }}
                        fontWeight={"bold"}
                    >
                        Create
                    </Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent bg={"black"} border={"1px solid gray"}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <Textarea
                            placeholder="Post Content goes here..."
                            value={postText}
                            onChange={handleTextChange}
                        />

                        <Text
                            fontSize={"xs"}
                            fontWeight={"bold"}
                            textAlign={"right"}
                            m={"1"}
                            color={"whiteAlpha.700"}
                        >
                            {remainingChar}/{MAX_CHAR}
                        </Text>

                        <Input
                            type="file"
                            hidden
                            ref={imageRef}
                            onChange={handleImageChange}
                        />

                        <BsFillImageFill
                            size={16}
                            style={{
                                marginTop: "15px",
                                marginLeft: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => imageRef.current.click()}
                        />

                        {selectedFile && (
                            <Flex
                                mt={5}
                                w={"full"}
                                justifyContent={"center"}
                                position={"relative"}
                            >
                                <Image src={selectedFile} alt="Selected Img" />
                                <CloseButton
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                    border={"1px solid black"}
                                    color={"white"}
                                    fontWeight={"bold"}
                                    bg={"gray.800"}
                                    onClick={() => setSelectedFile(null)}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            mr={3}
                            colorScheme="blue"
                            isLoading={isLoading}
                            onClick={handleCreatePost}
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;
