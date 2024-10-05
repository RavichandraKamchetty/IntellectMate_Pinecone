import {
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import useShowToast from "../../hooks/useShowToast";

const CommentModal = ({ isOpen, onClose, post }) => {
    const commentRef = useRef(null);
    const commentContainerRef = useRef(null);
    const user = useRecoilValue(userAtom);
    console.log(post);
    const [isCommenting, setIsCommenting] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [comment, setComment] = useState("");
    const showToast = useShowToast();

    useEffect(() => {
        const scrollToBottom = () => {
            commentContainerRef.current.scrollTop =
                commentContainerRef.current.scrollHeight;
        };

        if (isOpen) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [isOpen, post.comments.length]);

    const handlePostComment = async (e) => {
        e.preventDefault();
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
            commentRef.current.value = "";
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsCommenting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
            <ModalOverlay />
            <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
                <ModalHeader>Comments</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <Flex
                        mb={4}
                        gap={4}
                        flexDir={"column"}
                        maxH={"250px"}
                        overflowY={"auto"}
                        ref={commentContainerRef}
                    >
                        {post.comments.map((comment, idx) => {
                            return <Comment key={idx} comment={comment} />;
                        })}
                    </Flex>
                    <form style={{ marginTop: "2rem" }}>
                        <Input
                            placeholder="Comment"
                            size={"sm"}
                            ref={commentRef}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Flex w={"full"} justifyContent={"flex-end"}>
                            <Button
                                type="submit"
                                ml={"auto"}
                                size={"sm"}
                                my={4}
                                onClick={handlePostComment}
                                isLoading={isCommenting}
                            >
                                Post
                            </Button>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CommentModal;
