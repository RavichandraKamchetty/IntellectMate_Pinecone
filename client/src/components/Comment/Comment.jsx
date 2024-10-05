import {
    Avatar,
    Flex,
    Skeleton,
    SkeletonCircle,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ comment }) => {
    console.log("comment: ", comment)

    return (
        <Flex gap={4}>
            <Avatar
                src={comment?.userProfilePic}
                alt={comment?.username}
                size={"sm"}
            />
            <Flex direction={"column"}>
                <Flex gap={2}>
                    <Text fontSize={12} fontWeight={"bold"}>
                        {comment?.username}
                    </Text>
                    <Text fontSize={14}>{comment?.text}</Text>
                </Flex>
                <Text
                    fontSize={12}
                    fontWeight={"bold"}
                    color={"whiteAlpha.400"}
                >
                    {formatDistanceToNow(new Date(comment?.createdAt))}
                </Text>
            </Flex>
        </Flex>
    );
};

export default Comment;

const CommentSkeleton = () => {
    return (
        <Flex gap={4} w="full" alignItems={"center"}>
            <SkeletonCircle h={10} w={10} />
            <Flex gap={1} flexDir={"column"}>
                <Skeleton h={2} w={100} />
                <Skeleton h={2} w={50} />
            </Flex>
        </Flex>
    );
};
