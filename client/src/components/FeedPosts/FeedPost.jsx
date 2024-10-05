import React, { useEffect, useState } from "react";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { Box, Container, Flex, Image, Text } from "@chakra-ui/react";
import useShowToast from "../../hooks/useShowToast";

const FeedPost = ({ post, postedBy, isProfilePage }) => {
    const showToast = useShowToast();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/users/profile/" + postedBy);
                const data = await res.json();
                console.log(data)

                if (data.error) {
                    showToast("Error", data.error, "error");
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setUser(null);
                return;
            }
        };
        getUser();
    }, [postedBy, showToast]);

    return (
        <>
            {post.imageURL ? (
                <>
                    <PostHeader post={post} creatorProfile={user} />
                    <Box my={2} borderRadius={4} overflow={"hidden"}>
                        <Image src={post.imageURL} />
                    </Box>
                    <PostFooter
                        post={post}
                        creatorProfile={user}
                        text={post.text}
                    />
                </>
            ) : (
                <>
                    {isProfilePage ? (
                        <Container
                            my={10}
                            border={"1px solid gray"}
                            p={10}
                            gap={4}
                        >
                            <PostHeader
                                post={post}
                                creatorProfile={user}
                                isProfilePage={isProfilePage}
                            />
                            <Flex my={2} minH={"75px"} alignItems={"center"}>
                                <Text mx={5} fontSize={18} fontWeight={"bold"}>
                                    {"--> "}
                                    {post.text}
                                </Text>
                            </Flex>
                            <PostFooter
                                post={post}
                                creatorProfile={user}
                                text={"@"}
                            />
                        </Container>
                    ) : (
                        <Container>
                            <PostHeader
                                post={post}
                                creatorProfile={user}
                                isProfilePage={isProfilePage}
                            />
                            <Flex my={2} minH={"75px"} alignItems={"center"}>
                                <Text mx={5} fontSize={18} fontWeight={"bold"}>
                                    {"--> "}
                                    {post.text}
                                </Text>
                            </Flex>
                            <PostFooter
                                post={post}
                                creatorProfile={user}
                                text={"@"}
                            />
                        </Container>
                    )}
                </>
            )}
        </>
    );
};

export default FeedPost;
