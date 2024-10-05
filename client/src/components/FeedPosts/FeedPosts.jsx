import React, { useEffect, useState } from "react";
import FeedPost from "./FeedPost";
import {
    Container,
    Flex,
    Skeleton,
    SkeletonCircle,
    VStack,
    Box,
    Text,
} from "@chakra-ui/react";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";

const FeedPosts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useRecoilState(postsAtom)
    const showToast = useShowToast();

    useEffect(() => {
        const getFeedPosts = async () => {
            setIsLoading(true);

            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();

                console.log(data);
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                return;
            } finally {
                setIsLoading(false);
            }
        };
        getFeedPosts();
    }, [showToast]);

    return (
        <Container maxW={"container.sm"} py={10} px={2}>
            {isLoading &&
                [0, 1, 2].map((_, idx) => (
                    <VStack
                        key={`skeleton_${idx}`}
                        gap={4}
                        alignItems={"flex-start"}
                        mb={10}
                    >
                        <Flex gap={2}>
                            <SkeletonCircle size={10} />
                            <VStack
                                gap={2}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Skeleton h="10px" w={"200px"} />
                                <Skeleton h="10px" w={"200px"} />
                            </VStack>
                        </Flex>

                        <Skeleton w={"full"}>
                            <Box h="400px">contents wrapped</Box>
                        </Skeleton>
                    </VStack>
                ))}

            {!isLoading &&
                posts.length > 0 &&
                posts.map((post) => (
                    <FeedPost
                        post={post}
                        key={post._id}
                        postedBy={post.postedBy}
                    />
                ))}

            {!isLoading && posts.length === 0 && (
                <>
                    <Text fontSize={"md"} color={"red.400"}>
                        Po ra rey poi evarnaina friends chesko po
                    </Text>
                    <Text color={"red.400"}>
                        Kanisam evadnaina follow kottu ra 🤦‍♂️
                    </Text>
                </>
            )}
        </Container>
    );
};

export default FeedPosts;
