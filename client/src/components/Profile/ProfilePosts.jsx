import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";
import { IoCameraOutline } from "react-icons/io5";
import useGetUserPosts from "../../hooks/useGetUserPosts";

const ProfilePosts = () => {
    const { fetchingPosts, posts, setPosts } = useGetUserPosts();

    const noPostsFound = !fetchingPosts && posts?.length === 0 ;

    if (noPostsFound) return <NoPostsFound />;

    return (
        <Grid
            templateColumns={{
                sm: "repeat(1, 1fr)",
                md: "repeat(3, 1fr)",
            }}
            gap={1}
            columnGap={1}
        >
            {fetchingPosts &&
                [0, 1, 2, 3, 4, 5].map((_, idx) => {
                    return (
                        <VStack key={idx} alignItems={"flex-start"} gap={4}>
                            <Skeleton w={"full"}>
                                <Box h={"300px"}>contents wrapped</Box>
                            </Skeleton>
                        </VStack>
                    );
                })}

            {!fetchingPosts &&
                posts?.map((post) => (
                    <ProfilePost
                        key={post._id}
                        post={post}
                        postedBy={post.postedBy}
                    />
                ))}
        </Grid>
    );
};

export default ProfilePosts;

const NoPostsFound = () => {
    return (
        <VStack textAlign={"center"} mx={"auto"} mt={10}>
            <Box
                border={"1px solid gray"}
                borderRadius={"50%"}
                p={3}
                alignItems={"center"}
                justifyContent={"center"}
                color={"gray"}
            >
                <IoCameraOutline size={25} />
            </Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
                No Posts Yet
            </Text>
        </VStack>
    );
};
