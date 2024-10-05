import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { formatDistanceToNow } from "date-fns";

const Caption = ({ post }) => {
    const userProfile = useRecoilValue(userAtom)

    return (
        <Flex gap={4}>
            <Avatar
                src={userProfile?.profilePicURL}
                alt={userProfile?.username}
                size={"sm"}
            />
            <Flex direction={"column"}>
                <Flex gap={2}>
                    <Text fontSize={12} fontWeight={"bold"}>
                        {userProfile?.username}
                    </Text>
                    <Text fontSize={14}>{post.text}</Text>
                </Flex>
                <Text
                    fontSize={12}
                    fontWeight={"bold"}
                    color={"whiteAlpha.400"}
                >
                    {formatDistanceToNow(new Date(post?.createdAt))}
                </Text>
            </Flex>
        </Flex>
    );
};

export default Caption;
