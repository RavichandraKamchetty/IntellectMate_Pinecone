import { Box, Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";

const ProfileTabs = ({ activeTab, onTabClick }) => {
    return (
        <Flex
            w={"full"}
            justifyContent={"center"}
            gap={{ base: 4, sm: 10 }}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            position="relative"
        >
            <Flex
                alignItems={"center"}
                p={3}
                gap={1}
                cursor={"pointer"}
                onClick={() => onTabClick("Posts")}
                position="relative"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: activeTab === "Posts" ? "100%" : "0",
                    height: "2px",
                    backgroundColor: "white",
                    transition: "width 0.2s ease-in-out",
                }}
            >
                <Box fontSize={20}>
                    <BsGrid3X3 />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>
                    Posts
                </Text>
            </Flex>

            <Flex
                alignItems={"center"}
                p={3}
                gap={1}
                cursor={"pointer"}
                onClick={() => onTabClick("Text_Posts")}
                position="relative"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: activeTab === "Text_Posts" ? "100%" : "0",
                    height: "2px",
                    backgroundColor: "white",
                    transition: "width 0.2s ease-in-out",
                }}
            >
                <Box fontSize={20}>
                    <BsGrid3X3 />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>
                    Text_Posts
                </Text>
            </Flex>

            <Flex
                alignItems={"center"}
                p={3}
                gap={1}
                cursor={"pointer"}
                onClick={() => onTabClick("Saved")}
                position="relative"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: activeTab === "Saved" ? "100%" : "0",
                    height: "2px",
                    backgroundColor: "white",
                    transition: "width 0.2s ease-in-out",
                }}
            >
                <Box fontSize={20}>
                    <BsBookmark />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>
                    Saved
                </Text>
            </Flex>

            <Flex
                alignItems={"center"}
                p={3}
                gap={1}
                cursor={"pointer"}
                onClick={() => onTabClick("Liked")}
                position="relative"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: activeTab === "Liked" ? "100%" : "0",
                    height: "2px",
                    backgroundColor: "white",
                    transition: "width 0.2s ease-in-out",
                }}
            >
                <Box fontSize={20}>
                    <BsSuitHeart fontWeight={"bold"} />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>
                    Liked
                </Text>
            </Flex>
        </Flex>
    );
};

export default ProfileTabs;
