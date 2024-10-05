import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { BsFillChatTextFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

const Chat = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <Tooltip
            hasArrow
            label="Messages"
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
                onClick={() => navigate("/chat")}
            >
                <BsFillChatTextFill size={20} />
                <Box
                    display={{ base: "none", md: pathname == "/chat" ? "none" : "block", }}
                    fontWeight={"bold"}
                >
                    Messages
                </Box>
            </Flex>
        </Tooltip>
    );
};

export default Chat;
