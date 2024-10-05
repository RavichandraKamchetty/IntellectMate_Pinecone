import {
    Avatar,
    AvatarGroup,
    Button,
    Flex,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    useDisclosure,
    Box,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import EditProfile from "./EditProfile";
import postsAtom from "../../atoms/postsAtom";
import useFollowUser from "../../hooks/useFollowUser";

const ProfileHeader = ({ user }) => {
    const authUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);

    // First useDisclosure for Edit Profile Modal
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();

    // Second useDisclosure for 'More' Modal
    const {
        isOpen: isMoreOpen,
        onOpen: onMoreOpen,
        onClose: onMoreClose,
    } = useDisclosure();

    const { handleFollowUnfollow, isFollowing, isUpdating } =
        useFollowUser(user);

    const visitingOwnProfileAndAuth =
        authUser && authUser.username === user?.username;
    const visitingAnotherProfileAndAuth =
        authUser && authUser.username !== user?.username;

    function truncate(string, n) {
        return string?.length > n ? string.substr(0, n - 1) + "..." : string;
    }

    return (
        <>
            <Flex
                gap={{ base: 4, sm: 10 }}
                direction={{ base: "column", sm: "row" }}
                py={10}
            >
                <AvatarGroup
                    size={{ base: "xl", md: "2xl" }}
                    justifySelf={"center"}
                    alignSelf={"flex-start"}
                    mx={"auto"}
                >
                    {visitingOwnProfileAndAuth ? (
                        <Avatar
                            src={authUser.profilePicURL}
                            alt="Profile Pic"
                        />
                    ) : (
                        <Avatar src={user?.profilePicURL} alt="Profile Pic" />
                    )}
                </AvatarGroup>

                <VStack alignItems={"flex-start"} gap={2} mx={"auto"} flex={1}>
                    <Flex
                        gap={4}
                        justifyContent={{ base: "center", sm: "flex-start" }}
                        alignItems={"center"}
                        w={"full"}
                        direction={{ base: "column", sm: "row" }}
                    >
                        <Text fontSize={{ base: "md", sm: "lg" }}>
                            {user?.username}
                        </Text>

                        {visitingOwnProfileAndAuth && (
                            <Flex
                                gap={4}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Button
                                    color={"black"}
                                    bg={"white"}
                                    size={{ base: "xs", md: "sm" }}
                                    _hover={{ bg: "whiteAlpha.800" }}
                                    onClick={onEditOpen} // Using onEditOpen here
                                >
                                    Edit Profile
                                </Button>
                            </Flex>
                        )}

                        {visitingAnotherProfileAndAuth && (
                            <Flex
                                gap={4}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Button
                                    bg={"blue.500"}
                                    color={"white"}
                                    _hover={{ bg: "blue.600" }}
                                    size={{ base: "xs", md: "sm" }}
                                    isLoading={isUpdating}
                                    onClick={handleFollowUnfollow}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
                        <Text fontSize={{ base: "xs", md: "sm" }}>
                            <Text as={"span"} fontWeight={"bold"} mr={1}>
                                {posts.length}
                            </Text>
                            Posts
                        </Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>
                            <Text as={"span"} fontWeight={"bold"} mr={1}>
                                {user?.followers.length}
                            </Text>
                            Followers
                        </Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>
                            <Text as={"span"} fontWeight={"bold"} mr={1}>
                                {user?.following.length}
                            </Text>
                            Following
                        </Text>
                    </Flex>
                    <Flex alignItems={"center"} gap={4}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {visitingOwnProfileAndAuth
                                ? authUser.fullName
                                : user?.fullName}
                        </Text>
                    </Flex>
                    <Text fontSize={"sm"}>
                        {visitingOwnProfileAndAuth
                            ? truncate(authUser.bio, 200)
                            : truncate(user?.bio, 200)}
                    </Text>
                    <Button onClick={onMoreOpen}>More</Button>{" "}
                    {/* Using onMoreOpen here */}
                </VStack>

                {isEditOpen && (
                    <EditProfile isOpen={isEditOpen} onClose={onEditClose} />
                )}
            </Flex>

            {/* More Modal to show all user information */}
            <Modal isOpen={isMoreOpen} onClose={onMoreClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent bg={"black"} border={"1px solid gray"}>
                    <ModalHeader textAlign="center">Profile Details</ModalHeader>
                    <ModalCloseButton />
                    <Flex direction="column" align="center" p={6}>
                        <Avatar
                            size="2xl"
                            src={
                                visitingOwnProfileAndAuth
                                    ? authUser.profilePicURL
                                    : user?.profilePicURL
                            }
                            alt="Profile Picture"
                            mb={4}
                        />
                        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                            {[
                                { label: "Email", value: user?.email },
                                { label: "Username", value: user?.username },
                                { label: "Full Name", value: user?.fullName },
                                { label: "Age", value: user?.age },
                                { label: "Sex", value: user?.sex },
                                { label: "Major", value: user?.major },
                                { label: "Year", value: user?.year },
                                { label: "GPA", value: user?.gpa },
                                {
                                    label: "Hobbies",
                                    value: user?.hobbies?.join(", "),
                                },
                                { label: "Country", value: user?.country },
                                { label: "State", value: user?.state },
                                {
                                    label: "Unique Quality",
                                    value: user?.uniqueQuality,
                                },
                            ].map((item, index) => (
                                <GridItem
                                    key={index}
                                    p={3}
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    boxShadow="sm"
                                >
                                    <Text fontWeight="bold">
                                        {item.label}:
                                    </Text>
                                    <Text>{item.value}</Text>
                                </GridItem>
                            ))}
                            <GridItem colSpan={2}>
                                <Text fontWeight="bold">Bio:</Text>
                                <Text>{user?.bio}</Text>
                            </GridItem>
                        </Grid>
                    </Flex>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileHeader;
