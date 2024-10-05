import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useFollowOrUnfollow from "../../hooks/useFollowOrUnfollow";

const SuggestedUser = ({ user }) => {
    const { handleFollowUnfollow, isFollowing, isUpdating } =
        useFollowOrUnfollow(user);

    return (
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
            <Flex alignItems={"center"} gap={2}>
                <Link to={`/${user.username}`}>
                    <Avatar src={user.profilePicURL} alt={name} size={"md"} />
                </Link>
                <VStack spacing={0} alignItems={"flex-start"}>
                    <Link to={`/${user.username}`}>
                        <Box fontSize={14} fontWeight={"bold"}>
                            {user.username}
                        </Box>
                    </Link>
                    <Box color={"gray.500"} fontSize={14}>
                        {user.followers.length} followers
                    </Box>
                </VStack>
            </Flex>

            <Button
                fontSize={13}
                cursor={"pointer"}
                bg={"transparent"}
                p={0}
                h={"max-content"}
                fontWeight={"medium"}
                color={"blue.400"}
                _hover={{ color: "white" }}
                isLoading={isUpdating}
                onClick={handleFollowUnfollow}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
        </Flex>
    );
};

export default SuggestedUser;
