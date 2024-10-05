import {
    Avatar,
    Box,
    Button,
    Flex,
    Skeleton,
    SkeletonCircle,
} from "@chakra-ui/react";
import useFollowOrUnfollow from "../../hooks/useFollowOrUnfollow";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MdDelete } from "react-icons/md";
import useShowToast from "../../hooks/useShowToast";
import { useState } from "react";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";

const PostHeader = ({ post, creatorProfile, isProfilePage }) => {
    const { isFollowing, isUpdating, handleFollowUnfollow } =
        useFollowOrUnfollow(creatorProfile);

    const [isDeleting, setIsDeleting] = useState(false);
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom);

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
        <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            w={"full"}
            my={2}
        >
            <Flex alignItems={"center"} gap={2}>
                {creatorProfile ? (
                    <Link to={`/${creatorProfile.username}`}>
                        <Avatar
                            src={creatorProfile.profilePicURL}
                            alt={creatorProfile.username}
                            size={"sm"}
                            w={5}
                            h={5}
                        />
                    </Link>
                ) : (
                    <SkeletonCircle size={10} />
                )}
                <Flex fontSize={14} fontWeight={"bold"} gap={2}>
                    {creatorProfile ? (
                        <Link to={`/${creatorProfile.username}`}>
                            {creatorProfile.username}
                        </Link>
                    ) : (
                        <Skeleton w={"100px"} h={"10px"} />
                    )}
                    <Box color={"gray.500"} fontSize={"xs"}>
                        • {formatDistanceToNow(new Date(post.createdAt))} ago
                    </Box>
                </Flex>
            </Flex>

            <Box cursor={"pointer"}>
                <Button
                    size={"sm"}
                    bg={"transparent"}
                    fontSize={12}
                    color={"blue.500"}
                    fontWeight={"bold"}
                    _hover={{ color: "white" }}
                    transition={"0.2s ease-in-out"}
                    isLoading={isUpdating}
                    onClick={handleFollowUnfollow}
                    display={isProfilePage ? "none" : "block"}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            </Box>

            {isProfilePage && (
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
                    <MdDelete size={20} cursor={"pointer"} />
                </Button>
            )}
        </Flex>
    );
};

export default PostHeader;
