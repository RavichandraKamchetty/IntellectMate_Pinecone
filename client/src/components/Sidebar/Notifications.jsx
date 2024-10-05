import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import { useLocation } from "react-router-dom";

const Notifications = () => {
    const { pathname } = useLocation();
    return (
        <Tooltip
            hasArrow
            label="Notifications"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: pathname == "/chat" ? "block" : "none" }}
        >
            <Flex
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
                <NotificationsLogo />
                <Box
                    display={{ base: "none", md: pathname == "/chat" ? "none" : "block", }}
                    fontWeight={"bold"}
                >
                    Notifications
                </Box>
            </Flex>
        </Tooltip>
    );
};

export default Notifications;
