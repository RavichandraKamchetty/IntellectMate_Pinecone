import { Avatar, Box, Button, Flex, Image, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
    CreatePostLogo,
    InstagramLogo,
    InstagramMobileLogo,
    NotificationsLogo,
    SearchLogo,
} from "../../assets/constants";
import { AiFillHome } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import SidebarItems from "./SidebarItems";
import useShowToast from "../../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import authScreenAtom from "../../atoms/authAtom";

const Sidebar = () => {
    const { pathname } = useLocation();
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);
    const setScreen = useSetRecoilState(authScreenAtom);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            localStorage.removeItem("user-info");

            setScreen("login");
            setUser(null);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        }
    };

    const sidebarItems = [
        {
            icon: <AiFillHome size={25} />,
            text: "Home",
            link: "/",
        },
        {
            icon: <SearchLogo />,
            text: "Search",
        },
        {
            icon: <NotificationsLogo />,
            text: "Notifications",
        },
        {
            icon: <CreatePostLogo />,
            text: "Create",
        },
        {
            icon: <Avatar size={"sm"} name="RC" src="/rc.png" />,
            text: "Profile",
            link: "chinku24",
        },
    ];

    return (
        <Box
            height={"100vh"}
            py={8}
            position={"sticky"}
            top={0}
            left={0}
            borderRight={"1px solid"}
            borderColor={"whiteAlpha.300"}
            px={{ base: 2, md: pathname === '/chat' ? 2 : 4 }}
        >
            <Flex direction={"column"} gap={10} w={"full"} height={"full"}>
                <Link
                    to={"/"}
                    as={RouterLink}
                    pl={2}
                    display={{
                        base: "none",
                        md: pathname == "/chat" ? "none" : "block",
                    }}
                    cursor={"pointer"}
                >
                    <Image src="/intellect.png" />
                </Link>

                <Link
                    to={"/"}
                    as={RouterLink}
                    p={2}
                    display={{
                        base: "block",
                        md: pathname == "/chat" ? "block" : "none",
                    }}
                    borderRadius={6}
                    _hover={{ bg: "whiteAlpha.200" }}
                    w={10}
                    cursor={"pointer"}
                >
                    <Image src="/intellect2.png" w={'50px'} />
                </Link>

                {/* Nav Items */}
                <Flex direction={"column"} gap={5} cursor={"pointer"} >
                    <SidebarItems />
                </Flex>
                <Tooltip
                    hasArrow
                    label={"Logout"}
                    placement="right"
                    ml={1}
                    openDelay={500}
                    display={{ base: "block", md: pathname == "/chat" ? "block" : "none", }}
                >
                    <Flex
                        alignItems={"center"}
                        gap={4}
                        _hover={{ bg: "whiteAlpha.400" }}
                        borderRadius={6}
                        p={2}
                        w={{ base: 10, md: pathname == "/chat" ? 10 : "full" }}
                        justifyContent={{ base: "center", md: pathname == "/chat" ? "center" : "flex-start"}}
                        mt={"auto"}
                        onClick={handleLogout}
                        cursor={"pointer"}
                    >
                        <BiLogOut size={25} />
                        <Button
                            display={{ base: "none", md: pathname == "/chat" ? "none" : "block" }}
                            fontWeight={"bold"}
                            variant={"ghost"}
                            _hover={{ bg: "transparent" }}
                        >
                            Logout
                        </Button>
                    </Flex>
                </Tooltip>
            </Flex>
        </Box>
    );
};

export default Sidebar;
