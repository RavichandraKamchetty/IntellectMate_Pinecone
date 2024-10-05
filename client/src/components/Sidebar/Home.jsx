import { Box, Link, Tooltip } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Home = () => {
    const { pathname } = useLocation();
    return (
        <Tooltip
            hasArrow
            label="Home"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: pathname == "/chat" ? "block" : "none" }}
        >
            <Link
                display={"flex"}
                to={"/"}
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
                <AiFillHome size={25} />
                <Box
                    display={{ base: "none", md: pathname == "/chat" ? "none" : "block", }}
                    fontWeight={"bold"}
                >
                    Home
                </Box>
            </Link>
        </Tooltip>
    );
};

export default Home;
