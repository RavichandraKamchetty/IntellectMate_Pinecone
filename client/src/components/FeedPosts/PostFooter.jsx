import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
    CommentLogo,
    NotificationsLogo,
    UnlikeLogo,
} from "../../assets/constants";
import CommentModal from "../Modals/CommentModal";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import { useRecoilValue, useRecoilState } from "recoil";
import useShowToast from "../../hooks/useShowToast";

const PostFooter = ({ post, creatorProfile, text, isProfilePage }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [isLiking, setIsLiking] = useState(false);
    const [liked, setLiked] = useState(
        post?.likes.some((like) => like.userId === user?._id)
    );
    const [isCommenting, setIsCommenting] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [comment, setComment] = useState("");

    const commentRef = useRef(null);

    const handleLikePost = async () => {
        if (!user)
            return showToast(
                "Error",
                "You must be logged in to like a post",
                "error"
            );
        if (isLiking) return;
        setIsLiking(true);

        try {
            const res = await fetch("/api/posts/like/" + post._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            if (!liked) {
                // Add the current user's like object to post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return {
                            ...p,
                            likes: [
                                ...p.likes,
                                {
                                    userId: user._id,
                                    userProfilePic: user.profilePicURL,
                                },
                            ],
                        };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            } else {
                // Remove the current user's like object from post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return {
                            ...p,
                            likes: p.likes.filter(
                                (like) => like.userId !== user._id
                            ),
                        };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            }

            setLiked(!liked);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsLiking(false);
        }
    };

    const handlePostComment = async () => {
        if (!user)
            return showToast(
                "Error",
                "You must be logged in to like a post",
                "error"
            );
        if (isCommenting) return;
        setIsCommenting(true);

        try {
            const res = await fetch("/api/posts/comment/" + post._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: comment }),
            });

            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return { ...p, comments: [...p.comments, data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            showToast("Success", "Reply posted successfully", "success");
            setComment("");
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsCommenting(false);
        }
    };

    return (
        <Box mb={10} marginTop={"auto"}>
            <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
                <Box onClick={handleLikePost} cursor={"pointer"} fontSize={18}>
                    {!liked ? <NotificationsLogo /> : <UnlikeLogo />}
                </Box>
                <Box
                    cursor={"pointer"}
                    fontSize={18}
                    onClick={() => commentRef.current.focus()}
                >
                    <CommentLogo />
                </Box>
            </Flex>

            <Flex gap={2} my={1}>
                {post?.likes.length === 0 && (
                    <Text textAlign={"center"}>🥱</Text>
                )}
                {post?.likes.length > 0 && (
                    <AvatarGroup size={"xs"} max={3}>
                        {post?.likes[0] && (
                            <Avatar src={post?.likes[0].userProfilePic} />
                        )}

                        {post?.likes[1] && (
                            <Avatar src={post?.likes[1].userProfilePic} />
                        )}

                        {post?.likes[2] && (
                            <Avatar src={post?.likes[2].userProfilePic} />
                        )}
                    </AvatarGroup>
                )}

                <Text fontWeight={600} fontSize={"sm"}>
                    {post?.likes.length} likes
                </Text>
            </Flex>

            {!isProfilePage && (
                <>
                    {text !== "@" && text && (
                        <Text fontWeight={700} fontSize={"sm"}>
                            {creatorProfile?.username}{" "}
                            <Text as={"span"} fontWeight={400} color={"white"}>
                                {post.text}
                            </Text>
                        </Text>
                    )}

                    <Flex gap={2} my={1}>
                        {post?.comments.length > 0 && (
                            <>
                                <AvatarGroup size={"xs"} max={3}>
                                    {post.comments[0] && (
                                        <Avatar
                                            src={
                                                post.comments[0].userProfilePic
                                            }
                                        />
                                    )}

                                    {post.comments[1] && (
                                        <Avatar
                                            src={
                                                post.comments[1].userProfilePic
                                            }
                                        />
                                    )}

                                    {post.comments[2] && (
                                        <Avatar
                                            src={
                                                post.comments[2].userProfilePic
                                            }
                                        />
                                    )}
                                </AvatarGroup>

                                <Text
                                    color={"gray"}
                                    fontSize={"sm"}
                                    onClick={onOpen}
                                    cursor={"pointer"}
                                >
                                    View all {post.comments.length} comments
                                </Text>
                            </>
                        )}
                    </Flex>
                    {isOpen ? (
                        <CommentModal
                            isOpen={isOpen}
                            onClose={onClose}
                            post={post}
                        />
                    ) : null}
                </>
            )}

            <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"full"}
                gap={2}
            >
                <InputGroup>
                    <Input
                        variant={"flushed"}
                        placeholder={"Add a comment..."}
                        fontSize={14}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentRef}
                    />
                    <InputRightElement>
                        <Button
                            fontSize={14}
                            color={"blue.500"}
                            bg={"transparent"}
                            _hover={{ color: "white" }}
                            fontWeight={600}
                            cursor={"pointer"}
                            onClick={handlePostComment}
                            isLoading={isCommenting}
                        >
                            Post
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Flex>
        </Box>
    );
};

export default PostFooter;
