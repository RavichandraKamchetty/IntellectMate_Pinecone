import { Avatar, Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";

const Profile = () => {

    const { pathname } = useLocation();
    const user = useRecoilValue(userAtom);

    return (
        <Tooltip
            hasArrow
            label="Profile"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: pathname == "/chat" ? "block" : "none" }}
        >
            <Link
                display={"flex"}
                to={`/${user.username}`}
                as={RouterLink}
                alignItems={"center"}
                gap={4}
                _hover={{ bg: "whiteAlpha.400" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: pathname == "/chat" ? 10 : "full" }}
                justifyContent={{
                    base: "center",
                    md: pathname == "/chat" ? "center" : "flex-start"
                }}
            >
                <Avatar size={"sm"} src={user.profilePicURL} />
                <Box
                    display={{ base: "none", md: pathname == "/chat" ? "none" : "block", }}
                    fontWeight={"bold"}
                >
                    Profile
                </Box>
            </Link>
        </Tooltip>
    );
};

export default Profile;
