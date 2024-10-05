import React, { useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    GridItem,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PostFooter from "../FeedPosts/PostFooter";
import Comment from "../Comment/Comment";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import postsAtom from "../../atoms/postsAtom";
import Caption from "../Comment/Caption";

const ProfilePost = ({ post, postedBy}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const authUser = useRecoilValue(userAtom);
    const { isLoading, user } = useGetUserProfile();
    const [isDeleting, setIsDeleting] = useState(false);
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom)

    const handleDeletePost = async (e) => {
        e.preventDefault();
        setIsDeleting(true);

        try {
            if (!window.confirm("Are you sure you want to delete the post?"))
                return;

            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            onClose();
            showToast("Success", "Post Deleted Successfully", "success");
            setPosts(posts.filter((p) => p._id !== post._id));
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {post.imageURL && (
                <GridItem
                    cursor={"pointer"}
                    border={"1px solid"}
                    borderColor={"whiteAlpha.300"}
                    borderRadius={4}
                    overflow={"hidden"}
                    position={"relative"}
                    aspectRatio={1 / 1}
                    onClick={onOpen}
                >
                    <Flex
                        opacity={0}
                        _hover={{ opacity: 1 }}
                        position={"absolute"}
                        top={0}
                        bottom={0}
                        left={0}
                        right={0}
                        bg={"blackAlpha.700"}
                        transition={"all 0.3s ease"}
                        zIndex={1}
                        justifyContent={"center"}
                        border={"1px solid black"}
                    >
                        <Flex
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={50}
                        >
                            <Flex>
                                <AiFillHeart size={20} />
                                <Text fontWeight={"bold"} ml={2}>
                                    {post.likes.length}
                                </Text>
                            </Flex>

                            <Flex>
                                <FaComment size={20} />
                                <Text fontWeight={"bold"} ml={2}>
                                    {post.comments.length}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Image
                        src={post.imageURL}
                        alt="Post"
                        w={"100%"}
                        h={"100%"}
                        objectFit={"cover"}
                    />
                </GridItem>
            )}

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered={true}
                size={{ base: "3xl", md: "5xl" }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody bg={"black"}>
                        <Flex
                            gap={4}
                            mx={"auto"}
                            w={{ base: "90%", sm: "70%", md: "full" }}
                            maxH={"90vh"}
                            minH={"50vh"}
                        >
                            <Flex
                                borderRadius={4}
                                overflow={"hidden"}
                                border={"1px solid"}
                                borderColor={"whiteAlpha.300"}
                                flex={1}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <Image src={post.imageURL} alt="Post" />{" "}
                                {/* h={"350px"} w={"full"}*/}
                            </Flex>

                            <Flex
                                flex={1}
                                flexDir={"column"}
                                px={10}
                                display={{ base: "none", md: "flex" }}
                                my={5}
                            >
                                <Flex
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                >
                                    <Flex gap={4} alignItems={"center"}>
                                        <Avatar
                                            src={post.imageURL}
                                            alt={"Profile Pic"}
                                            size={"sm"}
                                            name="Ravi Chandra"
                                        />
                                        <Text fontWeight={"bold"} fontSize={12}>
                                            {user?.username}
                                        </Text>
                                    </Flex>

                                    {authUser?._id === user?._id && (
                                        <Button
                                            size={"sm"}
                                            bg={"transparent"}
                                            _hover={{
                                                bg: "whiteAlpha.400",
                                                color: "red.600",
                                            }}
                                            borderRadius={4}
                                            p={1}
                                            onClick={handleDeletePost}
                                            isLoading={isDeleting}
                                        >
                                            <MdDelete
                                                size={20}
                                                cursor={"pointer"}
                                            />
                                        </Button>
                                    )}
                                </Flex>
                                <Divider my={4} bg={"gray.500"} />

                                <VStack
                                    w={"full"}
                                    maxH={"350px"}
                                    overflowY={"auto"}
                                    alignItems={"start"}
                                >
                                    {/* CAPTION */}
                                    {post.text && <Caption post={post} />}
                                    {post.comments.map((comment) => (
                                        <Comment
                                            comment={comment}
                                            key={comment._id}
                                        />
                                    ))}
                                </VStack>

                                <PostFooter isProfilePage={true} post={post} />
                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfilePost;
